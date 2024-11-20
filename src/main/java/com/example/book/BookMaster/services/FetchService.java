package com.example.book.BookMaster.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


import com.example.book.BookMaster.models.Provider;
import com.example.book.BookMaster.models.Service;
import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.repo.ProviderRepositoryInterface;
import com.example.book.BookMaster.repo.ServiceRepositoryInterface;
import com.example.book.BookMaster.repo.UserRepositoryInterface;

@org.springframework.stereotype.Service
public class FetchService {
	private UserRepositoryInterface userRepo;
	private ServiceRepositoryInterface serviceRepo;
	private ProviderRepositoryInterface providerRepo;
	
	public FetchService(UserRepositoryInterface userRepo, ServiceRepositoryInterface serviceRepo, ProviderRepositoryInterface providerRepo) {
		this.userRepo = userRepo;
		this.serviceRepo = serviceRepo;
		this.providerRepo = providerRepo;
	}
	
	public List<User> getUsers() {
		return (List<User>)this.userRepo.findAll();
	}
	
	public List<Service> getServices() {
		return (List<Service>)this.serviceRepo.findAll();
	}
	
	public List<Provider> getProviders() {
		return (List<Provider>)this.providerRepo.findAll();
	}
	
	public Optional<Provider> getProvider(UUID providerId) {
		return this.providerRepo.findById(providerId);
	}
	
	public Optional<Service> getService(UUID serviceId) {
		return this.serviceRepo.findById(serviceId);
	}
	
	public Optional<User> getUserByUsername(String username) {
		Optional<User> user = Optional.of(this.userRepo.findByUsername(username));
		
		if (user.isPresent()) {
			
		}
		
		return user;
	}

}
