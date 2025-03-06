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
	@Query(value = "SELECT reservation.* FROM reservation JOIN user_table ON reservation.user_id = user_table.user_id\r\n"
			+ "WHERE user_table.provider_provider_id = :providerId and CAST(reservation.date AS DATE) = :date", nativeQuery = true)
	List<Reservation> findByProviderIdAndDate(UUID providerId, LocalDate date);
}
