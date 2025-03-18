package com.example.book.BookMaster.web;

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
import com.example.book.BookMaster.services.AdminService;
import com.example.book.BookMaster.services.FetchService;
import com.example.book.BookMaster.web.DTO.AddServiceDTO;
import com.example.book.BookMaster.web.DTO.CreateProviderDTO;
import com.example.book.BookMaster.web.DTO.CreateServiceDTO;
import com.example.book.BookMaster.web.DTO.UpdateDescriptionProviderDTO;

@RestController
@RequestMapping(path = "/admin")
@RestResource(exported = true)
public class AdminController {
	AdminService adminService;
	FetchService fetchService;
	
	@Autowired
	public AdminController(AdminService adminService, FetchService fetchService) {
		this.adminService = adminService;
		this.fetchService = fetchService;
	}
	
	@PostMapping(path = "/addService")
	public ResponseEntity<String> addService(@RequestBody @Validated AddServiceDTO request) {
		this.adminService.addService(UUID.fromString(request.providerId), UUID.fromString(request.serviceId));
		
		return new ResponseEntity<String>("Service added to provider", HttpStatus.OK);
	}
	
	@PostMapping(path = "/createService")
	public ResponseEntity<Provider> createService(@RequestBody @Validated CreateServiceDTO request) {
		this.adminService.createService(new Service(request.name, request.description, request.tags, request.price, request.time), request.providerId);
		
		return new ResponseEntity<Provider>(this.fetchService.getProvider(request.providerId).get(), HttpStatus.OK);
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
}
