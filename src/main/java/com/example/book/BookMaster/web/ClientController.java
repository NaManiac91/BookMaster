package com.example.book.BookMaster.web;

import java.time.LocalDate;
import java.time.ZonedDateTime;
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

import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.services.ClientService;
import com.example.book.BookMaster.services.FetchService;
import com.example.book.BookMaster.web.DTO.CreateReservationDTO;

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
	
	@PostMapping(path = "/createReservation")
	public ResponseEntity<Reservation> createReservation(@RequestBody @Validated CreateReservationDTO request) {
			Reservation reservation = this.clientService.createReservation(
					  ZonedDateTime.parse(request.date).toLocalDate(), request.slots, UUID.fromString(request.userId), UUID.fromString(request.serviceId), UUID.fromString(request.providerId), request.note);
			return new ResponseEntity<Reservation>(reservation, HttpStatus.OK);
	}
	
	@GetMapping(path = "/getAvailableTimeSlots")
	public ResponseEntity<List<String>> getAvailableTimeSlots(@RequestParam @Validated String providerId, LocalDate date) {
		  return new ResponseEntity<List<String>>(this.clientService.getAvailableTimeSlots(UUID.fromString(providerId), date), HttpStatus.OK);
	}
	
	@GetMapping(path = "/removeReservation")
	public ResponseEntity<Boolean> removeReservation(@RequestParam @Validated String reservationId) {
			boolean isRemoved = this.clientService.removeReservation(UUID.fromString(reservationId));
			return new ResponseEntity<Boolean>(isRemoved, HttpStatus.OK);
	}
}
