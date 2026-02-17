package com.example.book.BookMaster.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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
	        Set<User> participants = new LinkedHashSet<>();
	        participants.add(consumer);
	        participants.add(provider);
	        reservation.setUsers(participants);
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
	
	public Map<LocalDate, List<String>> getAvailableTimeSlots(UUID providerId, LocalDate date) {
		try {
			// Retrieve provider information to check time slot
			Provider provider = this.providerRepo.findById(providerId)
					.orElseThrow(() -> new RuntimeException("Provider not found with ID: " + providerId));
	        LocalTime startTime = provider.getStartTime();
	        LocalTime endTime = provider.getEndTime();
	        int timeBlockMinutes = provider.getTimeBlockMinutes();

	        Map<LocalDate, List<String>> availableSlotsByDate = new LinkedHashMap<>();
	        final int windowDays = 4;
	        final int maxSearchDays = 365;

	        // Move forward day-by-day until we find the first date with at least one free slot.
	        LocalDate firstAvailableDate = date;
	        boolean found = false;
	        for (int i = 0; i < maxSearchDays; i++) {
	        	LocalDate currentDate = date.plusDays(i);
	        	List<String> availableSlots = this.buildAvailableSlotsForDate(providerId, currentDate, startTime, endTime, timeBlockMinutes);
	        	if (!availableSlots.isEmpty()) {
	        		firstAvailableDate = currentDate;
	        		found = true;
	        		break;
	        	}
	        }

	        // If nothing is available in the search horizon, keep original behavior from requested date.
	        if (!found) {
	        	firstAvailableDate = date;
	        }

	        // Return the standard 4-day window starting from the first useful date.
	        for (int i = 0; i < windowDays; i++) {
	        	LocalDate currentDate = firstAvailableDate.plusDays(i);
	        	List<String> availableSlots = this.buildAvailableSlotsForDate(providerId, currentDate, startTime, endTime, timeBlockMinutes);
	        	availableSlotsByDate.put(currentDate, availableSlots);
	        	logger.info("Available slots for {} on {}: {}", providerId, currentDate, availableSlots);
	        }

	        return availableSlotsByDate;
		} catch (Exception e) {
	        logger.error("Error creating reservation: {}", e.getMessage(), e);
	        throw e; 
	    }
    }

	private List<String> buildAvailableSlotsForDate(UUID providerId, LocalDate date, LocalTime startTime, LocalTime endTime, int timeBlockMinutes) {
		List<String> availableSlots = new ArrayList<>();
		LocalTime currentTime = startTime;

		while (currentTime.isBefore(endTime)) {
			LocalTime nextTime = currentTime.plusMinutes(timeBlockMinutes);
			String timeSlot = currentTime.toString();
			availableSlots.add(timeSlot);
			currentTime = nextTime;
		}

		availableSlots.removeAll(this.getSlotBooked(providerId, date));
		return availableSlots;
	}

    public boolean isTimeSlotAvailable(List<String> slotBooked, String slot) {
        return slotBooked.contains(slot);
    }

    public boolean removeReservation(UUID reservationId) {
    	try {
	    	Reservation reservation = this.reservationRepo.findById(reservationId).get();	// Get reservation from DB

	    	// Remove reservation from every participant linked to the reservation.
	        boolean removed = false;
	        for (User participant : reservation.getUsers()) {
	        	User user = this.userRepo.findById(participant.getUserId()).orElse(null);
	        	if (user == null) {
	        		continue;
	        	}

	        	boolean removedForUser = user.getReservations().removeIf(r -> r.getReservationId().equals(reservation.getReservationId()));
	        	if (removedForUser) {
	        		this.userRepo.save(user);
	        	}
	        	removed = removed || removedForUser;
	        }

	        if (removed) {
	        	this.reservationRepo.delete(reservation);
				logger.info("Reservation {} removed", reservationId);
	        }
	        
	        return removed;
	    } catch (Exception e) {
	        logger.error("Error removing reservation: {}", e.getMessage(), e);
	        throw e; 
	    }
    }

	public List<Reservation> getReservationHistory(UUID userId) {
		try {
			List<Reservation> reservations = this.reservationRepo.findPastByUserId(userId, LocalDate.now());
			reservations.sort(Comparator.comparing(Reservation::getDate).reversed());

			for (Reservation reservation : reservations) {
				Service service = this.serviceRepo.findById(reservation.getServiceId())
						.orElse(null);
				if (service != null) {
					reservation.setService(service);
					reservation.setProvider(service.getProvider());
				}
				if (reservation.getProvider() == null && reservation.getProviderId() != null) {
					Provider provider = this.providerRepo.findById(reservation.getProviderId()).orElse(null);
					reservation.setProvider(provider);
				}
			}

			return reservations;
		} catch (Exception e) {
			logger.error("Error fetching reservation history for user {}: {}", userId, e.getMessage(), e);
			throw e;
		}
	}
    
    public User createUser(User user) {
    	try {
    		if (user.getProvider() != null) {
    			Provider provider = user.getProvider();

    			// Avoid transient/invalid provider objects sent by partial frontend payloads.
    			if (provider.getProviderId() != null) {
    				final UUID providerId = provider.getProviderId();
    				provider = this.providerRepo.findById(providerId)
    						.orElseThrow(() -> new RuntimeException("Provider not found with ID: " + providerId));
    				user.setProvider(provider);
    			} else if (provider.getName() == null || provider.getName().isBlank()) {
    				user.setProvider(null);
    			} else {
    				provider.setUser(user);
    			}
    		}

    		return this.userRepo.save(user);
    	} catch (Exception e) {
	        logger.error("Error creating user: {}", e.getMessage(), e);
	        throw e; 
    	}
    }
}
