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

import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.services.AdminService;

@RestController
@RequestMapping(path = "/provider")
@RestResource(exported = true)
public class ProviderController {
	AdminService adminService;
	
	@Autowired
	public ProviderController(AdminService adminService) {
		this.adminService = adminService;
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
	public ResponseEntity<String> createService(@RequestBody @Validated CreateServiceDTO request) {
		try {
		 this.adminService.createService(new Service(request.name, request.description, request.tags, request.price, request.time), request.providerId);
		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
        return new ResponseEntity<String>("Service Created", HttpStatus.OK);
	}
}
