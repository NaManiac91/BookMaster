package com.example.book.BookMaster.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.repo.ProviderRepositoryInterface;
import com.example.book.BookMaster.repo.ReservationRepositoryInterface;
import com.example.book.BookMaster.repo.ServiceRepositoryInterface;
import com.example.book.BookMaster.repo.UserRepositoryInterface;

@org.springframework.stereotype.Service
public class ClientService {
	private ReservationRepositoryInterface reservationRepo;
	private UserRepositoryInterface userRepo;
	private ServiceRepositoryInterface serviceRepo;
	private ProviderRepositoryInterface providerRepo;
	
	public ClientService(ReservationRepositoryInterface reservationRepo, 
						UserRepositoryInterface userRepo, 
						ServiceRepositoryInterface serviceRepo,
						ProviderRepositoryInterface providerRepo) {
		this.reservationRepo = reservationRepo;
		this.userRepo = userRepo;
		this.serviceRepo = serviceRepo;
		this.providerRepo = providerRepo;
	}
	
	public Reservation createReservation(LocalDate date, String slots, UUID userId, UUID serviceId, UUID providerId, String note) {
		User user = this.userRepo.findById(userId).get();
		Service service = this.serviceRepo.findById(serviceId).get();
		
		// Check if slot is already booked
		List<String> slotBooked = this.getSlotBooked(providerId, date);
        if (this.isTimeSlotAvailable(slotBooked, slots)) {
        	throw new RuntimeException("Slot already booked");
        }
		
        //Save new Reservation
        Reservation reservation = new Reservation(date, slots, providerId, note);
		
		user.addReservation(reservation);
		service.addReservation(reservation);
		
		reservation.setUser(user);
		reservation.setService(service);
		
		return this.reservationRepo.save(reservation);
	}
	
	public Reservation createReservation(Reservation reservation) {
		return this.reservationRepo.save(reservation);
	}
	
	private List<String> getSlotBooked(UUID providerId, LocalDate date) {
		List<Reservation> reservations = this.reservationRepo.findByProviderIdAndDate(providerId, date);

		List<String> slotBooked = new ArrayList<>();
		for (Reservation r : reservations) {
			slotBooked.addAll(r.getListSlot());
		}
		return slotBooked;
	}
	
	public List<String> getAvailableTimeSlots(UUID providerId, LocalDate date) {
		// Retrieve provider information to check time slot
		Provider provider = this.providerRepo.findById(providerId).get();
		LocalTime startTime = provider.getStartTime(); 
		LocalTime endTime = provider.getEndTime();
		int timeBlockMinutes = provider.getTimeBlockMinutes();
		
		List<String> availableSlots = new ArrayList<>();
        LocalTime currentTime = startTime;

        // Create all slots
        while (currentTime.isBefore(endTime)) {
            LocalTime nextTime = currentTime.plusMinutes(timeBlockMinutes);
            String timeSlot = currentTime.toString();

            availableSlots.add(timeSlot);

            currentTime = nextTime;
        }
        
        // Remove the slots already booked
        availableSlots.removeAll(this.getSlotBooked(providerId, date));

        return availableSlots;
    }

    public boolean isTimeSlotAvailable(List<String> slotBooked, String slot) {
        return slotBooked.contains(slot);
    }

    public boolean removeReservation(UUID reservationId) {
    	Reservation reservation = this.reservationRepo.findById(reservationId).get();	// Get reservation from DB
    	
    	/* Remove reservation from user and from service */
    	User user = this.userRepo.findById(reservation.getUser().getUserId()).get();
        boolean removed = user.getReservations().removeIf(r -> r.getReservationId().equals(reservation.getReservationId()));
       
        Service service = this.serviceRepo.findById(reservation.getService().getServiceId()).get();
        removed = service.getReservations().removeIf(r -> r.getReservationId().equals(reservation.getReservationId()));

        if (removed) {
        	this.userRepo.save(user);
        	this.serviceRepo.save(service);
        }
        
        return removed;
    }
}
