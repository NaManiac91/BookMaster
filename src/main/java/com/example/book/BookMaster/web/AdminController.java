package com.example.book.BookMaster.web;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.models.Language;
import com.example.book.BookMaster.services.AdminService;
import com.example.book.BookMaster.services.FetchService;
import com.example.book.BookMaster.services.TranslationService;
import com.example.book.BookMaster.web.DTO.AddServiceDTO;
import com.example.book.BookMaster.web.DTO.CreateProviderDTO;
import com.example.book.BookMaster.web.DTO.CreateServiceDTO;
import com.example.book.BookMaster.web.DTO.EditUserDTO;
import com.example.book.BookMaster.web.DTO.TranslationDto;
import com.example.book.BookMaster.web.DTO.UpdateDescriptionProviderDTO;
import com.example.book.BookMaster.web.DTO.UpsertTranslationRequest;

@RestController
@RequestMapping(path = "/admin")
@RestResource(exported = true)
public class AdminController {
	AdminService adminService;
	FetchService fetchService;
	TranslationService translationService;
	
	@Autowired
	public AdminController(AdminService adminService, FetchService fetchService, TranslationService translationService) {
		this.adminService = adminService;
		this.fetchService = fetchService;
		this.translationService = translationService;
	}
	
	@PostMapping(path = "/addService")
	public ResponseEntity<String> addService(@RequestBody @Validated AddServiceDTO request) {
		this.adminService.addService(UUID.fromString(request.providerId), UUID.fromString(request.serviceId));
		
		return new ResponseEntity<String>("Service added to provider", HttpStatus.OK);
	}
	
	@PostMapping(path = "/createService")
	public ResponseEntity<Provider> createService(@RequestBody @Validated CreateServiceDTO request) {
		if (request.providerId == null) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		this.adminService.createService(new Service(request.name, request.description, request.price, request.time), request.providerId);

		return new ResponseEntity<Provider>(this.fetchService.getProvider(request.providerId).get(), HttpStatus.OK);
	}
	
	@PostMapping(path = "/editService")
	public ResponseEntity<Provider> editService(@RequestBody @Validated Service request) {
		Service service = this.adminService.editService(request);
		UUID providerId = service.getProvider() != null ? service.getProvider().getProviderId() : null;
		Provider response = providerId != null ? this.fetchService.getProvider(providerId).orElse(service.getProvider()) : service.getProvider();
		return new ResponseEntity<Provider>(response, HttpStatus.OK);
	}
	
	@GetMapping(path = "/removeService")
	public ResponseEntity<Boolean> removeService(@RequestParam @Validated String serviceId) {
		return new ResponseEntity<Boolean>(this.adminService.removeService(UUID.fromString(serviceId)), HttpStatus.OK);
	}
	
	@PostMapping(path = "/createProvider", consumes = "application/json")
	public ResponseEntity<Provider> createProvider(@RequestBody @Validated CreateProviderDTO request) {
		Provider provider = new Provider(request.name, request.description, request.address, request.email, request.phone, request.type, request.startTime, request.endTime, request.timeBlockMinutes);
		Provider result = this.adminService.createProvider(provider, UUID.fromString(request.userId));

        return new ResponseEntity<Provider>(result, HttpStatus.OK);
	}
	
	@PostMapping(path = "/updateDescriptionProvider")
	public ResponseEntity<Provider> updateDescriptionProvider(@RequestBody @Validated UpdateDescriptionProviderDTO request) {
		UUID providerId = UUID.fromString(request.providerId);

		Provider p = this.fetchService.getProvider(providerId).get();
		p.setDescription(request.description);
		this.adminService.updateProvider(p);

        return new ResponseEntity<Provider>(this.fetchService.getProvider(providerId).get(), HttpStatus.OK);
	}

	@PostMapping(path = "/editProvider")
	public ResponseEntity<Provider> editProvider(@RequestBody @Validated Provider request) {
		Provider provider = this.adminService.updateProvider(request);
		Provider response = this.fetchService.getProvider(provider.getProviderId()).orElse(provider);
		return new ResponseEntity<Provider>(response, HttpStatus.OK);
	}

	@PostMapping(path = "/editUser")
	public ResponseEntity<User> editUser(@RequestBody @Validated EditUserDTO request) {
		User user = this.adminService.updateUser(request);
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}

	@GetMapping(path = "/getTranslations")
	public ResponseEntity<List<TranslationDto>> getTranslations(
			@RequestParam(required = false, defaultValue = "en") String language) {
		return new ResponseEntity<List<TranslationDto>>(
				this.translationService.getTranslations(Language.fromValue(language)),
				HttpStatus.OK);
	}

	@PostMapping(path = "/upsertTranslation")
	public ResponseEntity<TranslationDto> upsertTranslation(@RequestBody @Validated UpsertTranslationRequest request) {
		return new ResponseEntity<TranslationDto>(this.translationService.upsert(request), HttpStatus.OK);
	}
}
