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
	
	@PostMapping()
	@RequestMapping(path = "/addService")
	public ResponseEntity<String> addService(@RequestBody @Validated AddServiceDTO request) {
		try {
		 this.adminService.addService(UUID.fromString(request.providerId), UUID.fromString(request.serviceId));
		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
        return new ResponseEntity<String>("Service added to provider", HttpStatus.OK);
	}
	
	@PostMapping()
	@RequestMapping(path = "/createService")
	public ResponseEntity<Provider> createService(@RequestBody @Validated CreateServiceDTO request) {
		try {
		 this.adminService.createService(new Service(request.name, request.description, request.tags, request.price, request.time), request.providerId);
		} catch (Exception e) {
			return new ResponseEntity<Provider>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
        return new ResponseEntity<Provider>(this.fetchService.getProvider(request.providerId).get(), HttpStatus.OK);
	}
}
