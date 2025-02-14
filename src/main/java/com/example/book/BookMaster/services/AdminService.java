package com.example.book.BookMaster.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.Reservation;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.repo.ProviderRepositoryInterface;
import com.example.book.BookMaster.repo.ReservationRepositoryInterface;
import com.example.book.BookMaster.repo.ServiceRepositoryInterface;
import com.example.book.BookMaster.repo.UserRepositoryInterface;

@org.springframework.stereotype.Service
public class AdminService {
	private UserRepositoryInterface userRepo;
	private ServiceRepositoryInterface serviceRepo;
	private ProviderRepositoryInterface providerRepo;
	private ReservationRepositoryInterface reservationRepo;
	
	@Autowired
	public AdminService(
			UserRepositoryInterface userRepo, 
			ServiceRepositoryInterface serviceRepo, 
			ProviderRepositoryInterface providerRepo,
			ReservationRepositoryInterface reservationRepo) {
		this.userRepo = userRepo;
		this.serviceRepo = serviceRepo;
		this.providerRepo = providerRepo;
		this.reservationRepo = reservationRepo;
	}

	public User createUser(String username, String email) {
		return this.userRepo.save(new User(username, email));
	}
	
	public Service createService(String name) {
		return this.serviceRepo.save(new Service(name));
	}
	
	public Service createService(Service service, UUID providerId) {
		service.setProvider(this.providerRepo.findById(providerId).get());
		return this.serviceRepo.save(service);
	}
	
	public Provider createProvider(String name) {
		return this.providerRepo.save(new Provider(name));
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
		
		Reservation reservation = new Reservation(new Date(), user, service, "Book -> " + service.getName());
		user.addReservation(reservation);
		user.setProvider(provider);
		
		this.userRepo.save(user);
	}
	
	public void updateProvider(Provider provider) {
		this.providerRepo.save(provider);
	}
	
}
