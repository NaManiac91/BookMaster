package com.example.book.BookMaster.testing;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.Set;

import org.junit.jupiter.api.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.example.book.BookMaster.models.Address;
import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.ProviderType;
import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.repo.ProviderRepositoryInterface;
import com.example.book.BookMaster.repo.ReservationRepositoryInterface;
import com.example.book.BookMaster.repo.ServiceRepositoryInterface;
import com.example.book.BookMaster.repo.TranslationRepositoryInterface;
import com.example.book.BookMaster.repo.UserRepositoryInterface;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@Tag("ci")
public abstract class FunctionalTestSupport {

    @Autowired
    protected UserRepositoryInterface userRepo;

    @Autowired
    protected ProviderRepositoryInterface providerRepo;

    @Autowired
    protected ServiceRepositoryInterface serviceRepo;

    @Autowired
    protected ReservationRepositoryInterface reservationRepo;

    @Autowired
    protected TranslationRepositoryInterface translationRepo;

    protected Provider createProvider(String name, String city) {
        Provider provider = new Provider();
        provider.setName(name);
        provider.setDescription(name + " description");
        provider.setAddress(new Address("Main Street 1", city, "80100", "IT"));
        provider.setEmail(name.toLowerCase().replace(' ', '.') + "@bookmaster.test");
        provider.setPhone("3330001111");
        provider.setType(ProviderType.HEALTHCARE);
        provider.setStartTime(LocalTime.of(9, 0));
        provider.setEndTime(LocalTime.of(11, 0));
        provider.setTimeBlockMinutes(60);
        provider.setClosedDays(Set.of());
        provider.setClosedDates(Set.of());
        return this.providerRepo.save(provider);
    }

    protected Provider createProvider(String name, String city, Set<DayOfWeek> closedDays, Set<LocalDate> closedDates) {
        Provider provider = this.createProvider(name, city);
        provider.setClosedDays(closedDays == null ? Set.of() : closedDays);
        provider.setClosedDates(closedDates == null ? Set.of() : closedDates);
        return this.providerRepo.save(provider);
    }

    protected User createUser(String username) {
        return this.userRepo.save(new User(username, username + "@bookmaster.test"));
    }

    protected User createProviderUser(String username, Provider provider) {
        User providerUser = this.createUser(username);
        providerUser.setProvider(provider);
        return this.userRepo.save(providerUser);
    }

    protected Service createService(Provider provider, String name) {
        Service service = new Service(name, name + " description", 40.0f, 1);
        service.setProvider(provider);
        return this.serviceRepo.save(service);
    }

    protected Reservation createReservationRecord(LocalDate date, String slot, User consumer, User providerUser, Service service, Provider provider, String note) {
        Reservation reservation = new Reservation(date, slot, service.getServiceId(), provider.getProviderId(), note);
        Set<User> participants = new LinkedHashSet<>();
        participants.add(consumer);
        participants.add(providerUser);
        reservation.setUsers(participants);

        consumer.addReservation(reservation);
        providerUser.addReservation(reservation);

        return this.reservationRepo.save(reservation);
    }
}
