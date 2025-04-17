package com.example.book.BookMaster.services;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.repo.ProviderRepositoryInterface;
import com.example.book.BookMaster.repo.ServiceRepositoryInterface;
import com.example.book.BookMaster.repo.UserRepositoryInterface;

@org.springframework.stereotype.Service
public class FetchService {
    private static final Logger logger = LogManager.getLogger(FetchService.class);

	private UserRepositoryInterface userRepo;
	private ServiceRepositoryInterface serviceRepo;
	private ProviderRepositoryInterface providerRepo;
	
	public FetchService(UserRepositoryInterface userRepo, ServiceRepositoryInterface serviceRepo, ProviderRepositoryInterface providerRepo) {
		this.userRepo = userRepo;
		this.serviceRepo = serviceRepo;
		this.providerRepo = providerRepo;
	}
	
	public List<User> getUsers() {
		try {
			List<User> users = (List<User>)this.userRepo.findAll();
			logger.info("Users fetched");
			return users;
		} catch (Exception e) {
		    logger.error("Error fetching users: {}", e.getMessage(), e);
		    throw e; 
		}
	}
	
	public List<Service> getServices() {
		try {
			List<Service> services = (List<Service>)this.serviceRepo.findAll();
			logger.info("Services fetched");
			return services;
		} catch (Exception e) {
		    logger.error("Error fetching services: {}", e.getMessage(), e);
		    throw e; 
		}
	}
	
	public List<Provider> getProviders() {
		try {
			List<Provider> providers = (List<Provider>)this.providerRepo.findAll();
			logger.info("Providers fetched");
			return providers;
		} catch (Exception e) {
		    logger.error("Error fetching providers: {}", e.getMessage(), e);
		    throw e; 
		}
	}
	
	public Optional<Provider> getProvider(UUID providerId) {
		try {
			Optional<Provider> provider = this.providerRepo.findById(providerId);
			logger.info("Provider fetched: " + providerId);
			return provider;
		} catch (Exception e) {
		    logger.error("Error fetching provider: " + providerId + " {}", e.getMessage(), e);
		    throw e; 
		}
	}
	
	public Optional<Service> getService(UUID serviceId) {
		try {
			Optional<Service> service = this.serviceRepo.findById(serviceId);
			logger.info("Service fetched: " + serviceId);
			return service;
		} catch (Exception e) {
		    logger.error("Error fetching service: " + serviceId + " {}", e.getMessage(), e);
		    throw e; 
		}
	}
	
	public Optional<User> getUserByUsername(String username) {
		try {
			Optional<User> user = Optional.of(this.userRepo.findByUsername(username));
			
			if (user.isPresent() && user.get().getReservations().size() > 0) {
				Set<Reservation> reservations = user.get().getReservations();
				for (Reservation reservation : reservations) {
			        // Fetch and set service details
					Service service = this.serviceRepo.findById(reservation.getServiceId()).get();
					reservation.setService(service);
					reservation.setProvider(service.getProvider());
				}
			}
			
			logger.info("Fetch: {}", user);
			return user;
		} catch (Exception e) {
	        logger.error("Error fetching user: {}", e.getMessage(), e);
	        throw e; 
	    }
	}

}
