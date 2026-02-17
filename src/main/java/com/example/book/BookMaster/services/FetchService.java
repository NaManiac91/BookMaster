package com.example.book.BookMaster.services;

import java.util.List;
import java.util.Optional;
import java.util.LinkedHashMap;
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

	public List<Provider> searchProviders(String query, String type) {
		try {
			if (query == null || query.isBlank()) {
				return List.of();
			}

			final String normalizedQuery = query.trim();
			final String normalizedType = type == null ? "all" : type.trim().toLowerCase();
			List<Provider> providers;

			switch (normalizedType) {
				case "provider":
					providers = this.providerRepo.searchByProviderName(normalizedQuery);
					break;
				case "service":
					providers = this.providerRepo.searchByServiceName(normalizedQuery);
					break;
				default:
					providers = this.providerRepo.searchByNameOrServiceName(normalizedQuery);
					break;
			}

			List<Provider> distinctProviders = this.distinctByProviderId(providers);
			logger.info("Providers searched with query '{}' type '{}': {} (distinct: {})",
					query, normalizedType, providers.size(), distinctProviders.size());
			return distinctProviders;
		} catch (Exception e) {
			logger.error("Error searching providers for query '{}': {}", query, e.getMessage(), e);
			throw e;
		}
	}

	private List<Provider> distinctByProviderId(List<Provider> providers) {
		LinkedHashMap<UUID, Provider> distinct = new LinkedHashMap<>();
		for (Provider provider : providers) {
			if (provider != null && provider.getProviderId() != null) {
				distinct.putIfAbsent(provider.getProviderId(), provider);
			}
		}
		return List.copyOf(distinct.values());
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
			Optional<User> user = Optional.ofNullable(this.userRepo.findByUsername(username));
			
			if (user.isPresent() && user.get().getReservations().size() > 0) {
				Set<Reservation> reservations = user.get().getReservations();
				for (Reservation reservation : reservations) {
			        // Fetch and set service/provider details for serialization support fields.
					Service service = this.serviceRepo.findById(reservation.getServiceId()).orElse(null);
					if (service != null) {
						reservation.setService(service);
						reservation.setProvider(service.getProvider());
					}

					if (reservation.getProvider() == null && reservation.getProviderId() != null) {
						Provider provider = this.providerRepo.findById(reservation.getProviderId()).orElse(null);
						reservation.setProvider(provider);
					}
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
