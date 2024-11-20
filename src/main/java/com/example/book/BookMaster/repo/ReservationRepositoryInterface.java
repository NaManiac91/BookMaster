package com.example.book.BookMaster.repo;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RestResource;

import com.example.book.BookMaster.models.Reservation;

public interface ReservationRepositoryInterface extends CrudRepository<Reservation, UUID> {
	@Override
	@RestResource(exported = false)
	<S extends Reservation> S save(S entity);
	
	@Override
	@RestResource(exported = false)
	<S extends Reservation> Iterable<S> saveAll(Iterable<S> entities);
	
	@Override
	@RestResource(exported = false)
	void deleteById(UUID id);
	
	@Override
	@RestResource(exported = false)
	 void delete(Reservation entity);
	
	@Override
	@RestResource(exported = false)
	void deleteAllById(Iterable<? extends UUID> ids);
	
	@Override
	@RestResource(exported = false)
	void deleteAll(Iterable<? extends Reservation> entities);
	
	@Override
	@RestResource(exported = false)
    void deleteAll();
}
