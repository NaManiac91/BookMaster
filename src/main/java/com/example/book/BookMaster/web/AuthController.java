package com.example.book.BookMaster.web;

import java.util.HashMap;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.security.UserPrincipal;
import com.example.book.BookMaster.services.AuthService;
import com.example.book.BookMaster.web.DTO.AuthChangePasswordRequest;
import com.example.book.BookMaster.web.DTO.AuthLoginRequest;
import com.example.book.BookMaster.web.DTO.AuthRegisterRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping({"/api", ""})
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody AuthRegisterRequest request,
                                                        HttpServletRequest httpRequest,
                                                        HttpServletResponse httpResponse) {
        User user = this.authService.register(request, httpRequest, httpResponse);
        return ResponseEntity.status(HttpStatus.CREATED).body(this.authResponse(user, "Registered successfully"));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthLoginRequest request,
                                                     HttpServletRequest httpRequest,
                                                     HttpServletResponse httpResponse) {
        User user = this.authService.login(request, httpRequest, httpResponse);
        return ResponseEntity.ok(this.authResponse(user, "Logged in successfully"));
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication, HttpServletRequest request) {
        Optional<User> user = this.resolveAuthenticatedUser(authentication, request);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(this.authResponse(user.get(), null));
    }

    @GetMapping("/auth/me")
    public ResponseEntity<Map<String, Object>> me(Authentication authentication, HttpServletRequest request) {
        Optional<User> user = this.resolveAuthenticatedUser(authentication, request);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(this.authResponse(user.get(), null));
    }

    @GetMapping("/auth/status")
    public ResponseEntity<Map<String, Object>> getAuthStatus(Authentication authentication, HttpServletRequest request) {
        Optional<User> user = this.resolveAuthenticatedUser(authentication, request);
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", user.isPresent());
        user.ifPresent(value -> {
            response.put("user", value);
            response.put("requiresPasswordChange", this.authService.requiresPasswordChange(value));
        });

        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        this.authService.logout(request, response);
        Map<String, String> payload = new HashMap<>();
        payload.put("message", "Logged out successfully");
        return ResponseEntity.ok(payload);
    }

    @PostMapping("/auth/changePassword")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody AuthChangePasswordRequest requestBody,
                                                              Authentication authentication,
                                                              HttpServletRequest request,
                                                              HttpServletResponse response) {
        Optional<User> user = this.resolveAuthenticatedUser(authentication, request);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User updated = this.authService.changePassword(user.get(), requestBody, request, response);
        return ResponseEntity.ok(this.authResponse(updated, "Password changed successfully"));
    }

    @GetMapping("/auth/callback")
    public ResponseEntity<Map<String, Object>> authCallback(Authentication authentication, HttpServletRequest request) {
        Optional<User> user = this.resolveAuthenticatedUser(authentication, request);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false));
        }

        Map<String, Object> response = this.authResponse(user.get(), null);
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> authResponse(User user, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", true);
        response.put("user", user);
        response.put("requiresPasswordChange", this.authService.requiresPasswordChange(user));
        if (message != null) {
            response.put("message", message);
        }
        return response;
    }

    private Optional<User> resolveAuthenticatedUser(Authentication authentication, HttpServletRequest request) {
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserPrincipal userPrincipal) {
                return this.authService.findUserById(userPrincipal.getUserId());
            }

            if (principal instanceof OAuth2User oauth2User) {
                String email = oauth2User.getAttribute("email");
                if (email != null) {
                    return Optional.of(this.authService.findOrCreateOAuthUser(oauth2User.getAttribute("name"), email));
                }
            }
        }

        return this.authService.resolveSessionPrincipal(request)
                .flatMap(userPrincipal -> this.authService.findUserById(userPrincipal.getUserId()));
    }
}
