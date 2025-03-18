package com.example.book.BookMaster.services;

import java.time.LocalDate;
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
		try {
			return this.userRepo.save(new User(username, email));
		} catch (Exception ex) {
			throw ex;
		}
	}
	
	public User createUserProvider(String username, String email, UUID providerId) {
		User user = new User(username, email);
		
		try {
			user.setProvider(this.providerRepo.findById(providerId).get());
			return this.userRepo.save(user);
		} catch (Exception ex) {
			throw ex;
		}
	}
	
	public Service createService(String name) {
		try {
			return this.serviceRepo.save(new Service(name));
		} catch (Exception ex) {
			throw ex;
		}
	}
	
	public Service createService(Service service, UUID providerId) {
		try {
			service.setProvider(this.providerRepo.findById(providerId).get());
			return this.serviceRepo.save(service);
		} catch (Exception ex) {
			throw ex;
		}
	}
	
	public Provider createProvider(Provider provider, UUID userId) {	
		try {
			provider.setUser(this.userRepo.findById(userId).get());
			return this.providerRepo.save(provider);
		} catch (Exception ex) {
			throw ex;
		}
	}
	
	public void addService(UUID providerId, UUID serviceId) {
		try {
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
		} catch (Exception ex) {
			throw ex;
		}
	}
	
	public boolean removeService(UUID serviceId) {
		try {
			this.serviceRepo.deleteById(serviceId);
			return true;
		} catch (Exception ex) {
			return false;
		}
	}
	
	public void randomReservation(User user) {
		Service service = ((List<Service>) this.serviceRepo.findAll()).get(0);
		Provider provider = ((List<Provider>) this.providerRepo.findAll()).get(0);
		
		addService(provider.getProviderId(), service.getServiceId());
		
		String slot = provider.getStartTime() + "," + provider.getEndTime() ;
		Reservation reservation = new Reservation(LocalDate.now(), slot, service.getServiceId(), provider.getProviderId(), "Book -> " + service.getName());
		
		user.addReservation(reservation);
		user.setProvider(provider);
		
		try {
			this.userRepo.save(user);
		} catch (Exception ex) {
			throw ex;
		}
	}
	
	public void updateProvider(Provider provider) {
		try {
			this.providerRepo.save(provider);
		} catch (Exception ex) {
			throw ex;
		}
	}
	
}
