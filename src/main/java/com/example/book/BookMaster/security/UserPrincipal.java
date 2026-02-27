package com.example.book.BookMaster.security;

import java.security.Principal;
import java.util.UUID;

public class UserPrincipal implements Principal {
    private final UUID userId;
    private final String username;
    private final String email;

    public UserPrincipal(UUID userId, String username, String email) {
        this.userId = userId;
        this.username = username;
        this.email = email;
    }

    public UUID getUserId() {
        return userId;
    }

    @Override
    public String getName() {
        return username;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }
}
