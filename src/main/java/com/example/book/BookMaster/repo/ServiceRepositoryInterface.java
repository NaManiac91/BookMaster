package com.example.book.BookMaster.repo;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RestResource;

import com.example.book.BookMaster.models.Service;

public interface ServiceRepositoryInterface extends CrudRepository<Service, UUID> {
	@Override
	@RestResource(exported = false)
	<S extends Service> S save(S entity);
	
	@Override
	@RestResource(exported = false)
	<S extends Service> Iterable<S> saveAll(Iterable<S> entities);
	
	@Override
	@RestResource(exported = false)
	void deleteById(UUID id);
	
	@Override
	@RestResource(exported = false)
	 void delete(Service entity);
	
	@Override
	@RestResource(exported = false)
	void deleteAllById(Iterable<? extends UUID> ids);
	
	@Override
	@RestResource(exported = false)
	void deleteAll(Iterable<? extends Service> entities);
	
	@Override
	@RestResource(exported = false)
    void deleteAll();
}
