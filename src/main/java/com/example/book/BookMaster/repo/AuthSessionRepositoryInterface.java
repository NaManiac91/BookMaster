package com.example.book.BookMaster.repo;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RestResource;

import com.example.book.BookMaster.models.AuthSession;

public interface AuthSessionRepositoryInterface extends CrudRepository<AuthSession, UUID> {
    @RestResource(exported = false)
    AuthSession findByTokenHash(String tokenHash);

    @RestResource(exported = false)
    List<AuthSession> findByUserUserIdAndRevokedAtIsNull(UUID userId);

    @RestResource(exported = false)
    List<AuthSession> findByExpiresAtBeforeAndRevokedAtIsNull(Instant cutoff);
}
