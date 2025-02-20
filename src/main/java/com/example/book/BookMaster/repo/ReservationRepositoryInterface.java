package com.example.book.BookMaster.repo;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.book.BookMaster.models.Reservation;

@RepositoryRestResource(exported = false)
public interface ReservationRepositoryInterface extends CrudRepository<Reservation, UUID> {
	
}
