package com.example.book.BookMaster.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {
    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("name", principal.getAttribute("name"));
        response.put("email", principal.getAttribute("email"));
        response.put("picture", principal.getAttribute("picture"));
        response.put("authenticated", true);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth/status")
    public ResponseEntity<Map<String, Object>> getAuthStatus(@AuthenticationPrincipal OAuth2User principal) {
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", principal != null);

        if (principal != null) {
            response.put("user", Map.of(
                    "name", principal.getAttribute("name"),
                    "email", principal.getAttribute("email")));
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth/callback")
    public ResponseEntity<Map<String, Object>> authCallback(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", Map.of(
                "name", principal.getAttribute("name"),
                "email", principal.getAttribute("email")));

        return ResponseEntity.ok(response);
    }
}