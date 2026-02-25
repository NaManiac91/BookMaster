package com.example.book.BookMaster.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.testing.FunctionalTestSupport;

class FetchServiceFunctionalTest extends FunctionalTestSupport {

    @Autowired
    private FetchService fetchService;

    @Test
    void searchProvidersShouldFilterByCityAndReturnDistinctProviders() {
        Provider naples = this.createProvider("Spa Napoli", "Naples");
        Provider rome = this.createProvider("Spa Roma", "Rome");

        this.createService(naples, "Spa Basic");
        this.createService(naples, "Spa Deluxe");
        this.createService(rome, "Spa Basic");

        List<Provider> filtered = this.fetchService.searchProviders("spa", "all", "Naples");

        assertEquals(1, filtered.size());
        assertEquals(naples.getProviderId(), filtered.getFirst().getProviderId());

        List<Provider> cityOnly = this.fetchService.searchProviders("", "all", "Rome");
        assertEquals(1, cityOnly.size());
        assertEquals(rome.getProviderId(), cityOnly.getFirst().getProviderId());
    }

    @Test
    void searchCitiesShouldReturnEmptyForBlankQuery() {
        this.createProvider("Med One", "Naples");
        this.createProvider("Med Two", "Rome");

        List<String> cities = this.fetchService.searchCities("   ");

        assertTrue(cities.isEmpty());
    }

    @Test
    void getUserByUsernameShouldHydrateReservationSupportFields() {
        Provider provider = this.createProvider("Studio Torino", "Turin");
        User providerUser = this.createProviderUser("provider.turin", provider);
        User consumer = this.createUser("consumer.turin");
        Service service = this.createService(provider, "Consulenza");

        Reservation reservation = this.createReservationRecord(
                LocalDate.now().plusDays(5),
                "09:00",
                consumer,
                providerUser,
                service,
                provider,
                "Check");

        Optional<User> result = this.fetchService.getUserByUsername(consumer.getUsername());

        assertTrue(result.isPresent());
        Reservation hydrated = result.get().getReservations().stream().findFirst().orElseThrow();
        assertEquals(reservation.getReservationId(), hydrated.getReservationId());
        assertNotNull(hydrated.getService());
        assertNotNull(hydrated.getProvider());
        assertEquals(service.getServiceId(), hydrated.getService().getServiceId());
        assertEquals(provider.getProviderId(), hydrated.getProvider().getProviderId());
    }
}
