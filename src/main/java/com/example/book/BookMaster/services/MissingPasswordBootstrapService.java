package com.example.book.BookMaster.services;

import java.util.List;
import java.util.stream.StreamSupport;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.repo.UserRepositoryInterface;

@Service
public class MissingPasswordBootstrapService {
    private static final Logger logger = LogManager.getLogger(MissingPasswordBootstrapService.class);

    private final UserRepositoryInterface userRepo;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.bootstrap-missing-passwords.enabled:false}")
    private boolean bootstrapEnabled;

    @Value("${app.security.bootstrap-missing-passwords.default-password:ChangeMe123!}")
    private String defaultPassword;

    public MissingPasswordBootstrapService(UserRepositoryInterface userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void bootstrapMissingPasswords() {
        if (!this.bootstrapEnabled) {
            return;
        }

        List<User> usersWithoutPassword = StreamSupport.stream(this.userRepo.findAll().spliterator(), false)
                .filter(user -> user != null && (user.getPasswordHash() == null || user.getPasswordHash().isBlank()))
                .toList();

        if (usersWithoutPassword.isEmpty()) {
            logger.info("Password bootstrap enabled: no users without password hash found.");
            return;
        }

        for (User user : usersWithoutPassword) {
            user.setPasswordHash(this.passwordEncoder.encode(this.defaultPassword));
        }
        this.userRepo.saveAll(usersWithoutPassword);

        logger.info("Password bootstrap completed: updated {} users without password hash.", usersWithoutPassword.size());
    }
}
