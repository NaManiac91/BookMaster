package com.example.book.BookMaster.repo;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RestResource;

import com.example.book.BookMaster.models.Provider;

public interface ProviderRepositoryInterface extends CrudRepository<Provider, UUID> {
	@Override
	@RestResource(exported = false)
	<S extends Provider> S save(S entity);
	
	@Override
	@RestResource(exported = false)
	<S extends Provider> Iterable<S> saveAll(Iterable<S> entities);
	
	@Override
	@RestResource(exported = false)
	void deleteById(UUID id);
	
	@Override
	@RestResource(exported = false)
	 void delete(Provider entity);
	
	@Override
	@RestResource(exported = false)
	void deleteAllById(Iterable<? extends UUID> ids);
	
	@Override
	@RestResource(exported = false)
	void deleteAll(Iterable<? extends Provider> entities);
	
	@Override
	@RestResource(exported = false)
    void deleteAll();
}
