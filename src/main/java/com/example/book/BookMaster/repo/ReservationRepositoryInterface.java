package com.example.book.BookMaster.repo;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RestResource;

import com.example.book.BookMaster.models.Reservation;

@RestResource(exported = false)
public interface ReservationRepositoryInterface extends CrudRepository<Reservation, UUID> {
	
}
