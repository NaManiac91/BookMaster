package com.example.book.BookMaster.web;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
		try {
		 this.adminService.addService(UUID.fromString(request.providerId), UUID.fromString(request.serviceId));
		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
        return new ResponseEntity<String>("Service added to provider", HttpStatus.OK);
	}
	
	@PostMapping(path = "/createService")
	public ResponseEntity<Provider> createService(@RequestBody @Validated CreateServiceDTO request) {
		try {
			this.adminService.createService(new Service(request.name, request.description, request.tags, request.price, request.time), request.providerId);
		} catch (Exception e) {
			return new ResponseEntity<Provider>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
        return new ResponseEntity<Provider>(this.fetchService.getProvider(request.providerId).get(), HttpStatus.OK);
	}
	
	@PostMapping(path = "/createProvider")
	public ResponseEntity<Provider> createProvider(@RequestBody @Validated CreateProviderDTO request) {
		Provider result;
		try {
			Provider provider = new Provider(request.name, request.description, request.address, request.email, request.phone, request.type, request.startTime, request.endTime, request.timeBlockMinutes);
			result = this.adminService.createProvider(provider, UUID.fromString(request.userId));
		} catch (Exception e) {
			return new ResponseEntity<Provider>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
        return new ResponseEntity<Provider>(result, HttpStatus.OK);
	}
	
	@PostMapping(path = "/updateDescriptionProvider")
	public ResponseEntity<Provider> updateDescriptionProvider(@RequestBody @Validated UpdateDescriptionProviderDTO request) {
		UUID providerId = UUID.fromString(request.providerId);
		try {
			Provider p = this.fetchService.getProvider(providerId).get();
			p.setDescription(request.description);
			this.adminService.updateProvider(p);
		} catch (Exception e) {
			return new ResponseEntity<Provider>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
        return new ResponseEntity<Provider>(this.fetchService.getProvider(providerId).get(), HttpStatus.OK);
	}
}
