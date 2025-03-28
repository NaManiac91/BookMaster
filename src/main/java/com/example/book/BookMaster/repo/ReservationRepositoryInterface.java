package com.example.book.BookMaster.repo;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.book.BookMaster.models.Reservation;

@RepositoryRestResource(exported = false)
public interface ReservationRepositoryInterface extends CrudRepository<Reservation, UUID> {		
	@Query(value = "SELECT reservation.* FROM reservation\r\n"
			+ "WHERE reservation.provider_id = :providerId and reservation.date = :date", nativeQuery = true)
	List<Reservation> findByProviderIdAndDate(UUID providerId, LocalDate date);
}
