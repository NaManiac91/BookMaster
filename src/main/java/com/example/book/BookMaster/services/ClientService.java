package com.example.book.BookMaster.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

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
    private static final Logger logger = LogManager.getLogger(ClientService.class);

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
	    try {
	        // Fetch user and provider
	        User consumer = this.userRepo.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
	        User provider = this.userRepo.findByProviderProviderId(providerId);
	        if (provider == null) {
	            throw new RuntimeException("Provider not found with ID: " + providerId);
	        }

	        // Check if slot is already booked
	        List<String> slotBooked = this.getSlotBooked(providerId, date);
	        if (this.isTimeSlotAvailable(slotBooked, slots)) {
	            throw new RuntimeException("Slot already booked");
	        }

	        // Create and save new reservation
	        Reservation reservation = new Reservation(date, slots, serviceId, providerId, note);
	        consumer.addReservation(reservation);
	        provider.addReservation(reservation);
	        reservation.setUsers(Set.of(consumer, provider));
	        Reservation response = this.reservationRepo.save(reservation);
	        logger.info("Reservation created: {}", response);

	        // Fetch and set service details
	        Service service = this.serviceRepo.findById(serviceId)
	            .orElseThrow(() -> new RuntimeException("Service not found with ID: " + serviceId));
	        response.setService(service);
	        response.setProvider(service.getProvider());
	        
	        return response;
	    } catch (Exception e) {
	        logger.error("Error creating reservation: {}", e.getMessage(), e);
	        throw e; 
	    }
	}
	
	public Reservation createReservation(Reservation reservation) {
		try {
	        Reservation response = this.reservationRepo.save(reservation);
	        logger.info("Reservation created: {}", response);
			return response;
		} catch (Exception e) {
	        logger.error("Error creating reservation: {}", e.getMessage(), e);
	        throw e; 
	    }
	}
	
	private List<String> getSlotBooked(UUID providerId, LocalDate date) {
		try {
			List<Reservation> reservations = this.reservationRepo.findByProviderIdAndDate(providerId, date);
	
			// Fetch booked slots in the given date
			List<String> slotBooked = new ArrayList<>();
			for (Reservation r : reservations) {
				slotBooked.addAll(r.getListSlot());
			}
			
			logger.info("Slot already booked for {} in {} : {}", providerId, date, slotBooked);
			return slotBooked;
		} catch (Exception e) {
	        logger.error("Error creating reservation: {}", e.getMessage(), e);
	        throw e; 
	    }
	}
	
	public List<String> getAvailableTimeSlots(UUID providerId, LocalDate date) {
		try {
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
			logger.info("Availabled slots for {} in {} : {}", providerId, date, availableSlots);
			
	        return availableSlots;
		} catch (Exception e) {
	        logger.error("Error creating reservation: {}", e.getMessage(), e);
	        throw e; 
	    }
    }

    public boolean isTimeSlotAvailable(List<String> slotBooked, String slot) {
        return slotBooked.contains(slot);
    }

    public boolean removeReservation(UUID reservationId) {
    	try {
	    	Reservation reservation = this.reservationRepo.findById(reservationId).get();	// Get reservation from DB
	    	
	    	// Remove reservation from user consumer and user provider
	    	Iterator<User> i = reservation.getUsers().iterator();
	    	User consumer = this.userRepo.findById(i.next().getUserId()).get();
	        boolean removed = consumer.getReservations().removeIf(r -> r.getReservationId().equals(reservation.getReservationId()));
	       
	        User provider = this.userRepo.findById(i.next().getUserId()).get();
	        removed = provider.getReservations().removeIf(r -> r.getReservationId().equals(reservation.getReservationId()));
	       
	        if (removed) {
	        	this.userRepo.save(consumer);
	        	this.userRepo.save(provider);
	        	this.reservationRepo.delete(reservation);
				logger.info("Reservation {} removed from {} - {}", reservationId, consumer.getUserId(), provider.getUserId());
	        }
	        
	        return removed;
	    } catch (Exception e) {
	        logger.error("Error removing reservation: {}", e.getMessage(), e);
	        throw e; 
	    }
    }
}
