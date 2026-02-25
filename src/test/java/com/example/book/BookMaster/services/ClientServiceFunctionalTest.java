package com.example.book.BookMaster.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.testing.FunctionalTestSupport;

class ClientServiceFunctionalTest extends FunctionalTestSupport {

    @Autowired
    private ClientService clientService;

    @Test
    void createReservationShouldPersistAndHydrateServiceData() {
        Provider provider = this.createProvider("Studio Medico Milano", "Milan");
        User providerUser = this.createProviderUser("provider.milano", provider);
        User consumer = this.createUser("consumer.milano");
        Service service = this.createService(provider, "Visita Generale");

        LocalDate date = LocalDate.now().plusDays(1);
        Reservation created = this.clientService.createReservation(
                date,
                "09:00",
                consumer.getUserId(),
                service.getServiceId(),
                provider.getProviderId(),
                "Prima visita");

        assertNotNull(created.getReservationId());
        assertNotNull(created.getService());
        assertEquals(service.getServiceId(), created.getService().getServiceId());
        assertEquals(provider.getProviderId(), created.getProviderId());

        Reservation persisted = this.reservationRepo.findById(created.getReservationId()).orElseThrow();
        assertEquals(2, persisted.getUsers().size());

        assertEquals(1, this.reservationRepo.findByProviderIdAndDate(provider.getProviderId(), date).size());
        assertNotNull(providerUser.getUserId());
    }

	@Test
	void createReservationShouldRejectAlreadyBookedSlot() {
        Provider provider = this.createProvider("Studio Dentistico Roma", "Rome");
        User providerUser = this.createProviderUser("provider.roma", provider);
        User consumer = this.createUser("consumer.roma");
        Service service = this.createService(provider, "Pulizia Dentale");

        LocalDate date = LocalDate.now().plusDays(2);
        this.createReservationRecord(date, "09:00", consumer, providerUser, service, provider, "Esistente");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> this.clientService.createReservation(
                date,
                "09:00",
                consumer.getUserId(),
                service.getServiceId(),
                provider.getProviderId(),
                "Duplicata"));

		assertTrue(exception.getMessage().contains("Slot already booked"));
	}

	@Test
	void createReservationShouldRejectProviderUserAsConsumer() {
		Provider bookingProvider = this.createProvider("Studio Booking", "Bologna");
		User bookingProviderUser = this.createProviderUser("provider.booking", bookingProvider);

		Provider targetProvider = this.createProvider("Studio Target", "Parma");
		this.createProviderUser("provider.target", targetProvider);
		Service service = this.createService(targetProvider, "Visita Specialistica");

		ProviderCannotBookException exception = assertThrows(ProviderCannotBookException.class, () -> this.clientService.createReservation(
				LocalDate.now().plusDays(1),
				"09:00",
				bookingProviderUser.getUserId(),
				service.getServiceId(),
				targetProvider.getProviderId(),
				"Tentativo"));

		assertTrue(exception.getMessage().contains("Provider users cannot create reservations"));
	}

    @Test
    void getAvailabilitySummaryShouldRespectClosuresAndExistingReservations() {
        LocalDate fromDate = LocalDate.now().plusDays(3);
        LocalDate toDate = fromDate.plusDays(1);

        Provider provider = this.createProvider(
                "Centro Wellness Torino",
                "Turin",
                Set.of(fromDate.getDayOfWeek()),
                Set.of());
        User providerUser = this.createProviderUser("provider.torino", provider);
        User consumer = this.createUser("consumer.torino");
        Service service = this.createService(provider, "Massaggio");

        this.createReservationRecord(toDate, "09:00", consumer, providerUser, service, provider, "Prenotata");

        Map<LocalDate, Integer> summary = this.clientService.getAvailabilitySummary(
                provider.getProviderId(),
                fromDate,
                toDate);

        assertEquals(0, summary.get(fromDate));
        assertEquals(1, summary.get(toDate));
    }
}
