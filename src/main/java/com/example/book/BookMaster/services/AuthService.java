package com.example.book.BookMaster.services;

import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.book.BookMaster.models.Language;
import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.repo.ProviderRepositoryInterface;
import com.example.book.BookMaster.repo.ServiceRepositoryInterface;
import com.example.book.BookMaster.repo.UserRepositoryInterface;
import com.example.book.BookMaster.security.UserPrincipal;
import com.example.book.BookMaster.web.DTO.AuthChangePasswordRequest;
import com.example.book.BookMaster.web.DTO.AuthLoginRequest;
import com.example.book.BookMaster.web.DTO.AuthRegisterRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthService {
    private static final Pattern NON_WORD = Pattern.compile("[^a-zA-Z0-9._-]");

    private final UserRepositoryInterface userRepo;
    private final ServiceRepositoryInterface serviceRepo;
    private final ProviderRepositoryInterface providerRepo;
    private final AuthSessionService authSessionService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.bootstrap-missing-passwords.default-password:ChangeMe123!}")
    private String defaultPassword;

    public AuthService(UserRepositoryInterface userRepo,
                       ServiceRepositoryInterface serviceRepo,
                       ProviderRepositoryInterface providerRepo,
                       AuthSessionService authSessionService,
                       PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.serviceRepo = serviceRepo;
        this.providerRepo = providerRepo;
        this.authSessionService = authSessionService;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(AuthRegisterRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }

        String username = requireText(request.username, "username");
        String email = normalizeEmail(requireText(request.email, "email"));
        String password = requireText(request.password, "password");

        if (password.length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters long");
        }

        if (this.userRepo.findByUsername(username) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        if (this.userRepo.findByEmail(email) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User(username, email);
        user.setFirstName(trimToNull(request.firstName));
        user.setLastName(trimToNull(request.lastName));
        user.setLanguage(Language.fromValue(request.language));
        user.setPasswordHash(this.passwordEncoder.encode(password));

        Provider provider = request.provider;
        if (provider != null && provider.getName() != null && !provider.getName().isBlank()) {
            provider.setUser(user);
            user.setProvider(provider);
        }

        User entity = this.userRepo.save(user);
        this.authSessionService.createSession(entity, httpRequest, httpResponse);
        return this.hydrateReservationSupportFields(entity);
    }

    public User login(AuthLoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }

        String identifier = requireText(request.identifier, "identifier");
        String password = requireText(request.password, "password");

        User user = this.userRepo.findByUsername(identifier);
        if (user == null) {
            user = this.userRepo.findByEmail(normalizeEmail(identifier));
        }

        if (user == null || user.getPasswordHash() == null || !this.passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        this.authSessionService.createSession(user, httpRequest, httpResponse);
        return this.hydrateReservationSupportFields(user);
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        this.authSessionService.revokeCurrentSession(request, response);
    }

    public User changePassword(User user,
                               AuthChangePasswordRequest request,
                               HttpServletRequest httpRequest,
                               HttpServletResponse httpResponse) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }

        String currentPassword = requireText(request.currentPassword, "currentPassword");
        String newPassword = requireText(request.newPassword, "newPassword");
        if (newPassword.length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters long");
        }
        if (newPassword.equals(this.defaultPassword)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password cannot be the default password");
        }

        String currentHash = user.getPasswordHash();
        if (currentHash == null || currentHash.isBlank() || !this.passwordEncoder.matches(currentPassword, currentHash)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid current password");
        }

        user.setPasswordHash(this.passwordEncoder.encode(newPassword));
        User entity = this.userRepo.save(user);

        this.authSessionService.revokeAllActiveSessions(entity);
        this.authSessionService.createSession(entity, httpRequest, httpResponse);
        return this.hydrateReservationSupportFields(entity);
    }

    public boolean requiresPasswordChange(User user) {
        if (user == null) {
            return false;
        }

        String passwordHash = user.getPasswordHash();
        if (passwordHash == null || passwordHash.isBlank()) {
            return false;
        }

        return this.passwordEncoder.matches(this.defaultPassword, passwordHash);
    }

    public Optional<UserPrincipal> resolveSessionPrincipal(HttpServletRequest request) {
        return this.authSessionService.resolveActiveSession(request)
                .map(authSession -> this.authSessionService.toPrincipal(authSession.getUser()));
    }

    public Optional<User> findUserById(UUID userId) {
        if (userId == null) {
            return Optional.empty();
        }
        return this.userRepo.findById(userId).map(this::hydrateReservationSupportFields);
    }

    public Optional<User> findUserByEmail(String email) {
        String normalizedEmail = trimToNull(email);
        if (normalizedEmail == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(this.userRepo.findByEmail(normalizedEmail.toLowerCase(Locale.ROOT)))
                .map(this::hydrateReservationSupportFields);
    }

    public User findOrCreateOAuthUser(String displayName, String email) {
        String normalizedEmail = normalizeEmail(requireText(email, "email"));
        User existingByEmail = this.userRepo.findByEmail(normalizedEmail);
        if (existingByEmail != null) {
            return existingByEmail;
        }

        String baseUsername = trimToNull(displayName);
        if (baseUsername == null) {
            baseUsername = normalizedEmail.split("@")[0];
        }
        baseUsername = NON_WORD.matcher(baseUsername).replaceAll("");
        if (baseUsername.isBlank()) {
            baseUsername = "user";
        }

        String candidate = baseUsername;
        int suffix = 1;
        while (this.userRepo.findByUsername(candidate) != null) {
            suffix++;
            candidate = baseUsername + suffix;
        }

        User user = new User(candidate, normalizedEmail);
        return this.hydrateReservationSupportFields(this.userRepo.save(user));
    }

    private User hydrateReservationSupportFields(User user) {
        if (user == null || user.getReservations() == null || user.getReservations().isEmpty()) {
            return user;
        }

        for (Reservation reservation : user.getReservations()) {
            if (reservation == null) {
                continue;
            }

            com.example.book.BookMaster.models.Service service = this.serviceRepo.findById(reservation.getServiceId()).orElse(null);
            if (service != null) {
                reservation.setService(service);
                reservation.setProvider(service.getProvider());
            }

            if (reservation.getProvider() == null && reservation.getProviderId() != null) {
                Provider provider = this.providerRepo.findById(reservation.getProviderId()).orElse(null);
                reservation.setProvider(provider);
            }
        }

        return user;
    }

    private String requireText(String value, String fieldName) {
        String normalized = trimToNull(value);
        if (normalized == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " is required");
        }
        return normalized;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
