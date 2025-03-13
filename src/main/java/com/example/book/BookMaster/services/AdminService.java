package com.example.book.BookMaster.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
		return this.userRepo.save(new User(username, email));
	}
	
	public User createUserProvider(String username, String email, UUID providerId) {
		User user = new User(username, email);
		user.setProvider(this.providerRepo.findById(providerId).get());
		return this.userRepo.save(user);
	}
	
	public Service createService(String name) {
		return this.serviceRepo.save(new Service(name));
	}
	
	public Service createService(Service service, UUID providerId) {
		service.setProvider(this.providerRepo.findById(providerId).get());
		return this.serviceRepo.save(service);
	}
	
	public Provider createProvider(Provider provider, UUID userId) {
		provider.setUser(this.userRepo.findById(userId).get());
		return this.providerRepo.save(provider);
	}
	
	public void addService(UUID providerId, UUID serviceId) {
		Optional<Service> service = this.serviceRepo.findById(serviceId);
		Optional<Provider> provider = this.providerRepo.findById(providerId);
		
		if (service.isPresent() && provider.isPresent()) {
			Provider p = provider.get();
			Service s = service.get();
			
			p.addService(s);
			
			this.providerRepo.save(p);
		} else {
			throw new RuntimeException("Missing service or provider");
		}
	}
	
	public void randomReservation(User user) {
		Service service = ((List<Service>) this.serviceRepo.findAll()).get(0);
		Provider provider = ((List<Provider>) this.providerRepo.findAll()).get(0);
		
		addService(provider.getProviderId(), service.getServiceId());
		
		String slot = provider.getStartTime() + "," + provider.getEndTime() ;
		Reservation reservation = new Reservation(slot, user, service, provider.getProviderId(), "Book -> " + service.getName());
		user.addReservation(reservation);
		user.setProvider(provider);
		
		this.userRepo.save(user);
	}
	
	public void updateProvider(Provider provider) {
		this.providerRepo.save(provider);
	}
	
}
