package com.example.book.BookMaster.services;

import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.repo.ReservationRepositoryInterface;
import com.example.book.BookMaster.repo.UserRepositoryInterface;

@org.springframework.stereotype.Service
public class ClientService {
	private ReservationRepositoryInterface reservationRepo;
	private UserRepositoryInterface userRepo;
	
	public ClientService(ReservationRepositoryInterface reservationRepo, UserRepositoryInterface userRepo) {
		this.reservationRepo = reservationRepo;
		this.userRepo = userRepo;
	}
	
	public Reservation createReservation(Reservation reservation) {
		reservation.getUser().addReservation(reservation);
		
		return this.reservationRepo.save(reservation);
	}
}
