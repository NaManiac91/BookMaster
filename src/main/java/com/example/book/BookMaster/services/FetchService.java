package com.example.book.BookMaster.services;

import java.util.List;
import java.util.Optional;
import java.util.LinkedHashMap;
import java.util.Map;
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
	private TranslationService translationService;
	
	public FetchService(UserRepositoryInterface userRepo,
						ServiceRepositoryInterface serviceRepo,
						ProviderRepositoryInterface providerRepo,
						TranslationService translationService) {
		this.userRepo = userRepo;
		this.serviceRepo = serviceRepo;
		this.providerRepo = providerRepo;
		this.translationService = translationService;
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

	public List<String> searchCities(String query) {
		try {
			if (query == null || query.isBlank()) {
				return List.of();
			}

			String normalizedQuery = query.trim();
			List<String> cities = this.providerRepo.searchCities(normalizedQuery);
			return cities.stream()
					.filter(city -> city != null && !city.isBlank())
					.map(String::trim)
					.distinct()
					.limit(10)
					.toList();
		} catch (Exception e) {
			logger.error("Error searching cities for query '{}': {}", query, e.getMessage(), e);
			throw e;
		}
	}

	public List<Provider> searchProviders(String query, String type) {
		return this.searchProviders(query, type, null);
	}

	public List<Provider> searchProviders(String query, String type, String city) {
		try {
			final String normalizedQuery = query == null ? "" : query.trim();
			final String normalizedCity = city == null ? "" : city.trim();
			final String normalizedType = type == null ? "all" : type.trim().toLowerCase();

			if (normalizedQuery.isBlank() && normalizedCity.isBlank()) {
				return List.of();
			}

			if (normalizedCity.isBlank()) {
				List<Provider> providers = this.searchByType(normalizedQuery, normalizedType);
				List<Provider> distinctProviders = this.distinctByProviderId(providers);
				logger.info("Providers searched with query '{}' type '{}': {} (distinct: {})",
						query, normalizedType, providers.size(), distinctProviders.size());
				return distinctProviders;
			}

			// City-only search.
			if (normalizedQuery.isBlank()) {
				List<Provider> cityProviders = this.providerRepo.searchByCity(normalizedCity);
				List<Provider> results = this.distinctByProviderId(cityProviders);
				logger.info("Providers searched by city '{}' only: {}", city, results.size());
				return results;
			}

			// Combined text + city search: strict AND.
			List<Provider> queryResults = this.searchByType(normalizedQuery, normalizedType);
			List<Provider> results = this.distinctByProviderId(
					queryResults.stream()
							.filter(provider -> this.isInCity(provider, normalizedCity))
							.toList());
			logger.info("Providers searched with query '{}' type '{}' city '{}': {}", query, normalizedType, city, results.size());
			return results;
		} catch (Exception e) {
			logger.error("Error searching providers for query '{}': {}", query, e.getMessage(), e);
			throw e;
		}
	}

	private List<Provider> searchByType(String normalizedQuery, String normalizedType) {
		if (normalizedQuery == null || normalizedQuery.isBlank()) {
			return List.of();
		}

		switch (normalizedType) {
			case "provider":
				return this.providerRepo.searchByProviderName(normalizedQuery);
			case "service":
				return this.providerRepo.searchByServiceName(normalizedQuery);
			default:
				return this.providerRepo.searchByNameOrServiceName(normalizedQuery);
		}
	}

	private boolean isInCity(Provider provider, String normalizedCity) {
		if (provider == null || provider.getAddress() == null || provider.getAddress().getCity() == null) {
			return false;
		}
		return provider.getAddress().getCity().trim().equalsIgnoreCase(normalizedCity);
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

	public Map<String, String> getTranslations(String language) {
		try {
			Map<String, String> translations = this.translationService.getTranslationsForLanguage(language);
			logger.info("Translations fetched for language '{}': {}", language, translations.size());
			return translations;
		} catch (Exception e) {
			logger.error("Error fetching translations for language '{}': {}", language, e.getMessage(), e);
			throw e;
		}
	}

}
