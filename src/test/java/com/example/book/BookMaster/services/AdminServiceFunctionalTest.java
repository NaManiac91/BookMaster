package com.example.book.BookMaster.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.book.BookMaster.models.Address;
import com.example.book.BookMaster.models.Language;
import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.ProviderType;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.testing.FunctionalTestSupport;
import com.example.book.BookMaster.web.DTO.EditUserDTO;

class AdminServiceFunctionalTest extends FunctionalTestSupport {

    @Autowired
    private AdminService adminService;

    @Test
    void createServiceShouldAttachProvider() {
        Provider provider = this.createProvider("Clinica Firenze", "Florence");

        Service payload = new Service("Controllo", "Controllo annuale", 80.0f, 2);
        Service created = this.adminService.createService(payload, provider.getProviderId());

        assertNotNull(created.getServiceId());
        assertNotNull(created.getProvider());
        assertEquals(provider.getProviderId(), created.getProvider().getProviderId());
    }

    @Test
    void editServiceShouldUpdateEditableFieldsAndKeepProviderRelation() {
        Provider providerA = this.createProvider("Provider A", "Bologna");
        Provider providerB = this.createProvider("Provider B", "Padua");
        Service service = this.createService(providerA, "Servizio A");

        Service request = new Service("Servizio Aggiornato", "Nuova descrizione", 99.5f, 3);
        request.setServiceId(service.getServiceId());
        request.setProvider(providerB);

        Service updated = this.adminService.editService(request);

        assertEquals("Servizio Aggiornato", updated.getName());
        assertEquals("Nuova descrizione", updated.getDescription());
        assertEquals(99.5f, updated.getPrice());
        assertEquals(3, updated.getTime());
        assertEquals(providerA.getProviderId(), updated.getProvider().getProviderId());
    }

    @Test
    void updateUserShouldCreateAndLinkProviderWhenPayloadContainsProviderData() {
        User user = this.createUser("editor.user");

        EditUserDTO request = new EditUserDTO();
        request.userId = user.getUserId().toString();
        request.username = "editor.user.updated";
        request.email = "editor.updated@bookmaster.test";
        request.firstName = "Mario";
        request.lastName = "Rossi";
        request.language = Language.IT.getCode();

        EditUserDTO.ProviderPayload providerPayload = new EditUserDTO.ProviderPayload();
        providerPayload.name = "Studio Nuovo";
        providerPayload.description = "Descrizione studio";
        providerPayload.address = new Address("Via Roma 10", "Naples", "80100", "IT");
        providerPayload.email = "studio.nuovo@bookmaster.test";
        providerPayload.phone = "3331234567";
        providerPayload.type = ProviderType.FITNESS_AND_WELLNESS;
        providerPayload.startTime = LocalTime.of(8, 0);
        providerPayload.endTime = LocalTime.of(12, 0);
        providerPayload.timeBlockMinutes = 30;
        request.provider = providerPayload;

        User updated = this.adminService.updateUser(request);

        assertEquals("editor.user.updated", updated.getUsername());
        assertEquals(Language.IT, updated.getLanguage());
        assertNotNull(updated.getProvider());
        assertEquals("Studio Nuovo", updated.getProvider().getName());
        assertEquals("Naples", updated.getProvider().getAddress().getCity());
    }

    @Test
    void createServiceShouldFailWhenProviderIsMissing() {
        Service payload = new Service("Test", "No provider", 10.0f, 1);

        assertThrows(IllegalArgumentException.class,
                () -> this.adminService.createService(payload, null));
    }
}
