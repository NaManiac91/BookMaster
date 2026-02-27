package com.example.book.BookMaster.services;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import com.example.book.BookMaster.models.AuthSession;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.repo.AuthSessionRepositoryInterface;
import com.example.book.BookMaster.security.UserPrincipal;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthSessionService {
    private static final int SESSION_TOKEN_BYTES = 32;

    private final AuthSessionRepositoryInterface authSessionRepo;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.security.session.cookie-name:BM_SESSION}")
    private String cookieName;

    @Value("${app.security.session.ttl-hours:168}")
    private long sessionTtlHours;

    @Value("${app.security.session.secure-cookie:false}")
    private boolean secureCookie;

    @Value("${app.security.session.same-site:Lax}")
    private String sameSite;

    public AuthSessionService(AuthSessionRepositoryInterface authSessionRepo) {
        this.authSessionRepo = authSessionRepo;
    }

    public AuthSession createSession(User user, HttpServletRequest request, HttpServletResponse response) {
        String rawToken = this.generateRawToken();
        Instant now = Instant.now();
        Instant expiresAt = now.plus(Duration.ofHours(this.sessionTtlHours));

        AuthSession session = new AuthSession();
        session.setUser(user);
        session.setTokenHash(this.hashToken(rawToken));
        session.setCreatedAt(now);
        session.setLastUsedAt(now);
        session.setExpiresAt(expiresAt);
        session.setIpAddress(this.clientIp(request));
        session.setUserAgent(this.userAgent(request));
        AuthSession entity = this.authSessionRepo.save(session);

        this.writeSessionCookie(response, rawToken);
        return entity;
    }

    public Optional<AuthSession> resolveActiveSession(HttpServletRequest request) {
        Optional<String> rawToken = this.readTokenFromCookies(request);
        if (rawToken.isEmpty()) {
            return Optional.empty();
        }

        AuthSession session = this.authSessionRepo.findByTokenHash(this.hashToken(rawToken.get()));
        if (session == null) {
            return Optional.empty();
        }

        Instant now = Instant.now();
        if (session.getRevokedAt() != null || !session.getExpiresAt().isAfter(now)) {
            return Optional.empty();
        }

        session.setLastUsedAt(now);
        return Optional.of(this.authSessionRepo.save(session));
    }

    public void revokeCurrentSession(HttpServletRequest request, HttpServletResponse response) {
        Optional<String> rawToken = this.readTokenFromCookies(request);
        if (rawToken.isPresent()) {
            AuthSession session = this.authSessionRepo.findByTokenHash(this.hashToken(rawToken.get()));
            if (session != null && session.getRevokedAt() == null) {
                session.setRevokedAt(Instant.now());
                this.authSessionRepo.save(session);
            }
        }

        this.clearSessionCookie(response);
    }

    public void revokeAllActiveSessions(User user) {
        Instant now = Instant.now();
        for (AuthSession session : this.authSessionRepo.findByUserUserIdAndRevokedAtIsNull(user.getUserId())) {
            session.setRevokedAt(now);
            this.authSessionRepo.save(session);
        }
    }

    public void clearSessionCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(this.cookieName, "")
                .httpOnly(true)
                .secure(this.secureCookie)
                .sameSite(this.sameSite)
                .path("/")
                .maxAge(Duration.ZERO)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    public UserPrincipal toPrincipal(User user) {
        return new UserPrincipal(user.getUserId(), user.getUsername(), user.getEmail());
    }

    private void writeSessionCookie(HttpServletResponse response, String rawToken) {
        ResponseCookie cookie = ResponseCookie.from(this.cookieName, rawToken)
                .httpOnly(true)
                .secure(this.secureCookie)
                .sameSite(this.sameSite)
                .path("/")
                .maxAge(Duration.ofHours(this.sessionTtlHours))
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    private Optional<String> readTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length == 0) {
            return Optional.empty();
        }

        for (Cookie cookie : cookies) {
            if (this.cookieName.equals(cookie.getName()) && cookie.getValue() != null && !cookie.getValue().isBlank()) {
                return Optional.of(cookie.getValue());
            }
        }

        return Optional.empty();
    }

    private String generateRawToken() {
        byte[] tokenBytes = new byte[SESSION_TOKEN_BYTES];
        this.secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawToken.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to hash session token", ex);
        }
    }

    private String clientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

    private String userAgent(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        return userAgent == null ? "" : userAgent;
    }
}
