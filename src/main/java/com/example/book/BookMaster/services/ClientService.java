package com.example.book.BookMaster.services;

import java.util.Date;
import java.util.UUID;

import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.repo.ReservationRepositoryInterface;
import com.example.book.BookMaster.repo.ServiceRepositoryInterface;
import com.example.book.BookMaster.repo.UserRepositoryInterface;

@org.springframework.stereotype.Service
public class ClientService {
	private ReservationRepositoryInterface reservationRepo;
	private UserRepositoryInterface userRepo;
	private ServiceRepositoryInterface serviceRepo;
	
	public ClientService(ReservationRepositoryInterface reservationRepo, UserRepositoryInterface userRepo, ServiceRepositoryInterface serviceRepo) {
		this.reservationRepo = reservationRepo;
		this.userRepo = userRepo;
		this.serviceRepo = serviceRepo;
	}
	
	public Reservation createReservation(Date date, UUID userId, UUID serviceId, String note) {
		User user = this.userRepo.findById(userId).get();
		Service service = this.serviceRepo.findById(serviceId).get();
		
		Reservation reservation = new Reservation(date, note);
		
		user.addReservation(reservation);
		service.addReservation(reservation);
		
		reservation.setUser(user);
		reservation.setService(service);
		
		return this.reservationRepo.save(reservation);
	}
	
	public Reservation createReservation(Reservation reservation) {
		return this.reservationRepo.save(reservation);
	}
}
