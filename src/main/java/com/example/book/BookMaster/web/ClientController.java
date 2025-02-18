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

import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.services.ClientService;
import com.example.book.BookMaster.services.FetchService;

@RestController
@RequestMapping(path = "/client")
@RestResource(exported = true)
public class ClientController {
	ClientService clientService;
	FetchService fetchService;
	
	@Autowired
	public ClientController(ClientService clientService, FetchService fetchService) {
		this.clientService = clientService;
		this.fetchService = fetchService;
	}
	
	@PostMapping()
	@RequestMapping(path = "/createReservation")
	public ResponseEntity<Reservation> createReservation(@RequestBody @Validated Reservation request) {
		try {
		  Reservation reservation = this.clientService.createReservation(request);

		  return new ResponseEntity<Reservation>(reservation, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<Reservation>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
