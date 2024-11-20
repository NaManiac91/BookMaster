package com.example.book.BookMaster.repo;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RestResource;

import com.example.book.BookMaster.models.User;

public interface UserRepositoryInterface extends CrudRepository<User, UUID> {
	@RestResource(exported = false)
	User findByUsername(String name);
	
	@Override
	@RestResource(exported = false)
	<S extends User> S save(S entity);
	
	@Override
	@RestResource(exported = false)
	<S extends User> Iterable<S> saveAll(Iterable<S> entities);
	
	@Override
	@RestResource(exported = false)
	void deleteById(UUID id);
	
	@Override
	@RestResource(exported = false)
	 void delete(User entity);
	
	@Override
	@RestResource(exported = false)
	void deleteAllById(Iterable<? extends UUID> ids);
	
	@Override
	@RestResource(exported = false)
	void deleteAll(Iterable<? extends User> entities);
	
	@Override
	@RestResource(exported = false)
    void deleteAll();
}
