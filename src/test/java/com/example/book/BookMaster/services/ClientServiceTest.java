package com.example.book.BookMaster.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.repo.ProviderRepositoryInterface;
import com.example.book.BookMaster.repo.ReservationRepositoryInterface;
import com.example.book.BookMaster.repo.ServiceRepositoryInterface;
import com.example.book.BookMaster.repo.UserRepositoryInterface;

@Disabled
public class ClientServiceTest {

    @Mock
    private ReservationRepositoryInterface reservationRepo;

    @Mock
    private UserRepositoryInterface userRepo;

    @Mock
    private ServiceRepositoryInterface serviceRepo;

    @Mock
    private ProviderRepositoryInterface providerRepo;

    @InjectMocks
    private ClientService clientService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateReservation() throws Exception {
        // Arrange
        LocalDate date = LocalDate.now();
        String slot = "10:00";
        UUID userId = UUID.randomUUID();
        UUID serviceId = UUID.randomUUID();
        UUID providerId = UUID.randomUUID();
        String note = "Test reservation";

        User user = new User();
        user.setUserId(userId);
        user.setProvider(new Provider());

        Service service = new Service();
        service.setServiceId(serviceId);

        Provider provider = new Provider();
        provider.setProviderId(UUID.randomUUID());
        provider.setTimeBlockMinutes(30);

        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(serviceRepo.findById(serviceId)).thenReturn(Optional.of(service));
        when(serviceRepo.findById(providerId)).thenReturn(Optional.of(service));
        when(providerRepo.findById(provider.getProviderId())).thenReturn(Optional.of(provider));
        when(reservationRepo.save(any(Reservation.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Reservation reservation = clientService.createReservation(date, slot, userId, serviceId, providerId, note);

        // Assert
        assertNotNull(reservation);
        assertEquals(date, reservation.getDate());
        assertEquals(LocalTime.parse(slot), reservation.getSlots());
        assertEquals(note, reservation.getNote());
        assertEquals(user, reservation.getUser());
        assertEquals(service, reservation.getService());
    }

    @Test
    public void testCreateReservation_SlotAlreadyBooked() {
        // Arrange
        LocalDate date = LocalDate.now();
        String slot = "10:00";
        UUID userId = UUID.randomUUID();
        UUID serviceId = UUID.randomUUID();
        UUID providerId = UUID.randomUUID();
        String note = "Test reservation";

        User user = new User();
        user.setUserId(userId);
        user.setProvider(new Provider());

        Service service = new Service();
        service.setServiceId(serviceId);

        Provider provider = new Provider();
        provider.setProviderId(UUID.randomUUID());
        provider.setTimeBlockMinutes(30);

        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(serviceRepo.findById(serviceId)).thenReturn(Optional.of(service));
        when(providerRepo.findById(provider.getProviderId())).thenReturn(Optional.of(provider));

        List<String> slotBooked = new ArrayList<>();
        slotBooked.add(slot);
        when(reservationRepo.findByProviderIdAndDate(provider.getProviderId(), date)).thenReturn(new ArrayList<>());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            clientService.createReservation(date, slot, userId, serviceId, providerId, note);
        });
    }

    @Test
    public void testGetAvailableTimeSlots() {
        // Arrange
        UUID providerId = UUID.randomUUID();
        LocalDate date = LocalDate.now();

        Provider provider = new Provider();
        provider.setProviderId(providerId);
        provider.setStartTime(LocalTime.of(9, 0));
        provider.setEndTime(LocalTime.of(17, 0));
        provider.setTimeBlockMinutes(60);

        when(providerRepo.findById(providerId)).thenReturn(Optional.of(provider));
        when(reservationRepo.findByProviderIdAndDate(providerId, date)).thenReturn(new ArrayList<>());

        // Act
        List<String> availableSlots = clientService.getAvailableTimeSlots(providerId, date);

        // Assert
        assertNotNull(availableSlots);
        assertEquals(8, availableSlots.size()); // 9:00, 10:00, ..., 16:00
    }

    @Test
    public void testIsTimeSlotAvailable() {
        // Arrange
        List<String> slotBooked = new ArrayList<>();
        slotBooked.add("10:00");
        slotBooked.add("11:00");

        // Act & Assert
        assertTrue(clientService.isTimeSlotAvailable(slotBooked, "10:00"));
        assertFalse(clientService.isTimeSlotAvailable(slotBooked, "12:00"));
    }
}