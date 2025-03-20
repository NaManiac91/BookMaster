package com.example.book.BookMaster.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.repo.ProviderRepositoryInterface;
import com.example.book.BookMaster.repo.ServiceRepositoryInterface;
import com.example.book.BookMaster.repo.UserRepositoryInterface;

@org.springframework.stereotype.Service
public class AdminService {
    private static final Logger logger = LogManager.getLogger(AdminService.class);

	private UserRepositoryInterface userRepo;
	private ServiceRepositoryInterface serviceRepo;
	private ProviderRepositoryInterface providerRepo;
	
	@Autowired
	public AdminService(
			UserRepositoryInterface userRepo, 
			ServiceRepositoryInterface serviceRepo, 
			ProviderRepositoryInterface providerRepo) {
		this.userRepo = userRepo;
		this.serviceRepo = serviceRepo;
		this.providerRepo = providerRepo;
	}

	public User createUser(String username, String email) {
		try {
			User user = this.userRepo.save(new User(username, email));
			logger.info("User created: {}", user);
			return user;
		} catch (Exception e) {
			logger.error("SQL error: {}", e.getMessage(), e);
			throw e;
		}
	}
	
	public User createUserProvider(String username, String email, UUID providerId) {
		try {
			User user = new User(username, email);
			user.setProvider(this.providerRepo.findById(providerId).get());
			User entity = this.userRepo.save(user);
			logger.info("User created: {}", entity);
			return entity;
		} catch (Exception e) {
			logger.error("SQL error: {}", e.getMessage(), e);
			throw e;
		}
	}
	
	public Service createService(String name) {
		try {
			Service service = this.serviceRepo.save(new Service(name));
			logger.info("Service created: {}", service);
			return service;
		} catch (Exception e) {
			logger.error("SQL error: {}", e.getMessage(), e);
			throw e;
		}
	}
	
	public Service createService(Service service, UUID providerId) {
		try {
			service.setProvider(this.providerRepo.findById(providerId).get());
			Service entity = this.serviceRepo.save(service);	
			logger.info("Service created: {}", entity);
			return entity;
		} catch (Exception e) {
			logger.error("SQL error: {}", e.getMessage(), e);
			throw e;
		}
	}
	
	public Service editService(Service service) {
		try {
			Service entity = this.serviceRepo.save(service);
			logger.info("Service edited: {}", entity);
			return entity;
		} catch (Exception e) {
			logger.error("SQL error: {}", e.getMessage(), e);
			throw e;
		}
	}
	
	public Provider createProvider(Provider provider, UUID userId) {	
		try {
			provider.setUser(this.userRepo.findById(userId).get());
			Provider entity = this.providerRepo.save(provider);
			logger.info("Provider created: {}", entity);
			return entity;
		} catch (Exception e) {
			logger.error("SQL error: {}", e.getMessage(), e);
			throw e;
		}
	}
	
	public void addService(UUID providerId, UUID serviceId) {
		try {
	        // Fetch user and provider
			Optional<Service> service = this.serviceRepo.findById(serviceId);
			Optional<Provider> provider = this.providerRepo.findById(providerId);
			
	        // If both exists create link and save
			if (service.isPresent() && provider.isPresent()) {
				Provider p = provider.get();
				Service s = service.get();
				
				p.addService(s);
				
				this.providerRepo.save(p);
				logger.info("Serice: {} added to Provider: {}", service, p.getName());
			} else {
				logger.error("Missing service or provider");
				throw new RuntimeException("Missing service or provider");
			}
		} catch (Exception e) {
			logger.error("SQL error: {}", e.getMessage(), e);
			throw e;
		}
	}
	
	public boolean removeService(UUID serviceId) {
		try {
			this.serviceRepo.deleteById(serviceId);
			logger.info("Service {} removed", serviceId);
			return true;
		} catch (Exception e) {
			logger.error("SQL error: {}", e.getMessage(), e);
			return false;
		}
	}
	
	public void randomReservation(User user) {
		try {
	        // Fetch user and provider
			Service service = ((List<Service>) this.serviceRepo.findAll()).get(0);
			Provider provider = ((List<Provider>) this.providerRepo.findAll()).get(0);
			
			addService(provider.getProviderId(), service.getServiceId());
			
			// Create and save new reservation
			String slot = provider.getStartTime() + "," + provider.getEndTime() ;
			Reservation reservation = new Reservation(LocalDate.now(), slot, service.getServiceId(), provider.getProviderId(), "Book -> " + service.getName());
			
			user.addReservation(reservation);
			user.setProvider(provider);
			
			this.userRepo.save(user);
		} catch (Exception e) {
			logger.error("SQL error: {}", e.getMessage(), e);
			throw e;
		}
	}
	
	public void updateProvider(Provider provider) {
		try {
			this.providerRepo.save(provider);
		} catch (Exception e) {
			logger.error("SQL error: {}", e.getMessage(), e);
			throw e;
		}
	}
	
}
