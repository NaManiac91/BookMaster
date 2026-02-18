package com.example.book.BookMaster.web;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.services.FetchService;

@RestController
@RequestMapping(path = "/fetch")
@RestResource(exported = true)
public class FetchController {
	FetchService fetchService;
	
	public FetchController(FetchService fetchService) {
		this.fetchService=  fetchService;
	}

	@GetMapping(path = "/getProvider")
	public ResponseEntity<Optional<Provider>> getProvider(@RequestParam @Validated String providerId) {
		Optional<Provider> response = this.fetchService.getProvider(UUID.fromString(providerId));

        return new ResponseEntity<Optional<Provider>>(response, HttpStatus.OK);
	}
	
	@GetMapping(path = "/getService")
	public ResponseEntity<Optional<Service>> getService(@RequestParam @Validated String serviceId) {
		Optional<Service> response = this.fetchService.getService(UUID.fromString(serviceId));

        return new ResponseEntity<Optional<Service>>(response, HttpStatus.OK);
	}
	
	@GetMapping(path = "/getUserByUsername")
	public ResponseEntity<Optional<User>> getUserByUsername(@RequestParam @Validated String username) {
		Optional<User> response = this.fetchService.getUserByUsername(username);
		
        return new ResponseEntity<Optional<User>>(response, HttpStatus.OK);
	}
	
	@GetMapping(path = "/getServices")
	public ResponseEntity<List<Service>> getService() {
		List<Service> response = this.fetchService.getServices();

        return new ResponseEntity<List<Service>>(response, HttpStatus.OK);
	}
	
	@GetMapping(path = "/getProviders")
	public ResponseEntity<List<Provider>> getProviders() {
		List<Provider> response = this.fetchService.getProviders();

        return new ResponseEntity<List<Provider>>(response, HttpStatus.OK);
	}

	@GetMapping(path = "/searchProviders")
	public ResponseEntity<List<Provider>> searchProviders(@RequestParam(required = false, defaultValue = "") String q,
														  @RequestParam(required = false, defaultValue = "all") String type,
														  @RequestParam(required = false) String city) {
		List<Provider> response = this.fetchService.searchProviders(q, type, city);

		return new ResponseEntity<List<Provider>>(response, HttpStatus.OK);
	}

	@GetMapping(path = "/searchCities")
	public ResponseEntity<List<String>> searchCities(@RequestParam(required = false, defaultValue = "") String q) {
		List<String> response = this.fetchService.searchCities(q);
		return new ResponseEntity<List<String>>(response, HttpStatus.OK);
	}
	
	@GetMapping(path = "/getUsers")
	public ResponseEntity<List<User>> getUsers() {
		List<User> response = this.fetchService.getUsers();

        return new ResponseEntity<List<User>>(response, HttpStatus.OK);
	}
}
