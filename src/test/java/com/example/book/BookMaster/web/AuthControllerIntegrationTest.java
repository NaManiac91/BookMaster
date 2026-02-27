package com.example.book.BookMaster.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.models.Address;
import com.example.book.BookMaster.services.ClientService;
import com.example.book.BookMaster.repo.ProviderRepositoryInterface;
import com.example.book.BookMaster.repo.ServiceRepositoryInterface;
import com.example.book.BookMaster.repo.UserRepositoryInterface;

import jakarta.servlet.http.Cookie;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "app.security.auth-disabled=false",
        "app.security.session.secure-cookie=false"
})
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepositoryInterface userRepo;

    @Autowired
    private ProviderRepositoryInterface providerRepo;

    @Autowired
    private ServiceRepositoryInterface serviceRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ClientService clientService;

    @Value("${app.security.bootstrap-missing-passwords.default-password:ChangeMe123!}")
    private String defaultPassword;

    @Test
    void registerCreatesSessionCookieAndAllowsMe() throws Exception {
        String body = """
                {
                  "username": "mario",
                  "email": "mario@bookmaster.test",
                  "password": "StrongPass123",
                  "language": "en"
                }
                """;

        MvcResult registerResult = this.mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.requiresPasswordChange").value(false))
                .andExpect(jsonPath("$.user.username").value("mario"))
                .andReturn();

        Cookie cookie = toCookie(registerResult.getResponse().getHeader("Set-Cookie"));

        this.mockMvc.perform(get("/api/auth/me")
                        .cookie(cookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.user.email").value("mario@bookmaster.test"));
    }

    @Test
    void loginRejectsInvalidPassword() throws Exception {
        User user = new User("alessio", "alessio@bookmaster.test");
        user.setPasswordHash(this.passwordEncoder.encode("GoodPassword123"));
        this.userRepo.save(user);

        String body = """
                {
                  "identifier": "alessio",
                  "password": "WrongPassword"
                }
                """;

        this.mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void logoutRevokesSession() throws Exception {
        String registerBody = """
                {
                  "username": "luca",
                  "email": "luca@bookmaster.test",
                  "password": "StrongPass123",
                  "language": "en"
                }
                """;

        MvcResult registerResult = this.mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated())
                .andReturn();

        Cookie cookie = toCookie(registerResult.getResponse().getHeader("Set-Cookie"));

        this.mockMvc.perform(post("/api/auth/logout")
                        .cookie(cookie))
                .andExpect(status().isOk());

        this.mockMvc.perform(get("/api/auth/me")
                        .cookie(cookie))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void changePasswordRevokesOldSessionAndAcceptsNewPassword() throws Exception {
        String registerBody = """
                {
                  "username": "giulia",
                  "email": "giulia@bookmaster.test",
                  "password": "StrongPass123",
                  "language": "en"
                }
                """;

        MvcResult registerResult = this.mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated())
                .andReturn();
        Cookie oldCookie = toCookie(registerResult.getResponse().getHeader("Set-Cookie"));

        String changeBody = """
                {
                  "currentPassword": "StrongPass123",
                  "newPassword": "NewPass123!"
                }
                """;

        MvcResult changeResult = this.mockMvc.perform(post("/api/auth/changePassword")
                        .cookie(oldCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(changeBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password changed successfully"))
                .andReturn();

        Cookie newCookie = toCookie(changeResult.getResponse().getHeader("Set-Cookie"));

        this.mockMvc.perform(get("/api/auth/me")
                        .cookie(oldCookie))
                .andExpect(status().isUnauthorized());

        this.mockMvc.perform(get("/api/auth/me")
                        .cookie(newCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username").value("giulia"));

        String oldLoginBody = """
                {
                  "identifier": "giulia",
                  "password": "StrongPass123"
                }
                """;
        this.mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(oldLoginBody))
                .andExpect(status().isUnauthorized());

        String newLoginBody = """
                {
                  "identifier": "giulia",
                  "password": "NewPass123!"
                }
                """;
        this.mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newLoginBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.requiresPasswordChange").value(false));
    }

    @Test
    void loginWithDefaultPasswordRequiresPasswordChange() throws Exception {
        User user = new User("default-user", "default@bookmaster.test");
        user.setPasswordHash(this.passwordEncoder.encode(this.defaultPassword));
        this.userRepo.save(user);

        String loginBody = """
                {
                  "identifier": "default-user",
                  "password": "%s"
                }
                """.formatted(this.defaultPassword);

        this.mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true))
                .andExpect(jsonPath("$.requiresPasswordChange").value(true));
    }

    @Test
    void changePasswordRejectsDefaultPassword() throws Exception {
        String registerBody = """
                {
                  "username": "marta",
                  "email": "marta@bookmaster.test",
                  "password": "StrongPass123",
                  "language": "en"
                }
                """;

        MvcResult registerResult = this.mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated())
                .andReturn();
        Cookie cookie = toCookie(registerResult.getResponse().getHeader("Set-Cookie"));

        String changeBody = """
                {
                  "currentPassword": "StrongPass123",
                  "newPassword": "%s"
                }
                """.formatted(this.defaultPassword);

        this.mockMvc.perform(post("/api/auth/changePassword")
                        .cookie(cookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(changeBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginHydratesReservationSupportFields() throws Exception {
        User consumer = new User("vick", "vick@mail.com");
        consumer.setPasswordHash(this.passwordEncoder.encode("StrongPass123"));
        consumer = this.userRepo.save(consumer);

        Provider provider = new Provider("Vick");
        provider.setAddress(new Address("Main Street 1", "Naples", "80100", "IT"));
        provider.setTimeBlockMinutes(30);
        provider = this.providerRepo.save(provider);

        User providerUser = new User("vick-provider", "vick-provider@mail.com");
        providerUser.setProvider(provider);
        this.userRepo.save(providerUser);

        Service service = new Service("Taglio");
        service.setProvider(provider);
        service = this.serviceRepo.save(service);

        this.clientService.createReservation(
                LocalDate.now(),
                "13:30,14:00",
                consumer.getUserId(),
                service.getServiceId(),
                provider.getProviderId(),
                null);

        String loginBody = """
                {
                  "identifier": "vick",
                  "password": "StrongPass123"
                }
                """;

        this.mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requiresPasswordChange").value(false))
                .andExpect(jsonPath("$.user.reservations[0].service.serviceId").value(service.getServiceId().toString()))
                .andExpect(jsonPath("$.user.reservations[0].providerName").value("Vick"))
                .andExpect(jsonPath("$.user.reservations[0].providerTimeBlockMinutes").value(30));
    }

    private static Cookie toCookie(String setCookieHeader) {
        if (setCookieHeader == null || setCookieHeader.isBlank()) {
            throw new IllegalStateException("Missing Set-Cookie header");
        }
        String cookieHeader = setCookieHeader.split(";", 2)[0].trim();
        int separator = cookieHeader.indexOf('=');
        if (separator <= 0 || separator == cookieHeader.length() - 1) {
            throw new IllegalStateException("Invalid Set-Cookie header: " + setCookieHeader);
        }
        String name = cookieHeader.substring(0, separator);
        String value = cookieHeader.substring(separator + 1);
        return new Cookie(name, value);
    }
}
