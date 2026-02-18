package com.example.book.BookMaster.repo;

import java.util.UUID;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.repository.query.Param;

import com.example.book.BookMaster.models.Provider;

@RepositoryRestResource(exported = false)
public interface ProviderRepositoryInterface extends CrudRepository<Provider, UUID> {
	@Query("SELECT DISTINCT p FROM Provider p LEFT JOIN FETCH p.services s "
			+ "WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
	List<Provider> searchByProviderName(@Param("query") String query);

	@Query("SELECT DISTINCT p FROM Provider p JOIN FETCH p.services s "
			+ "WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))")
	List<Provider> searchByServiceName(@Param("query") String query);

	@Query("SELECT DISTINCT p FROM Provider p LEFT JOIN FETCH p.services s "
			+ "WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) "
			+ "OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))")
	List<Provider> searchByNameOrServiceName(@Param("query") String query);

	@Query("SELECT DISTINCT p FROM Provider p LEFT JOIN FETCH p.services s "
			+ "WHERE p.address IS NOT NULL "
			+ "AND LOWER(p.address.city) = LOWER(:city)")
	List<Provider> searchByCity(@Param("city") String city);

	@Query("SELECT DISTINCT p.address.city FROM Provider p "
			+ "WHERE p.address IS NOT NULL "
			+ "AND p.address.city IS NOT NULL "
			+ "AND LOWER(p.address.city) LIKE LOWER(CONCAT('%', :query, '%')) "
			+ "ORDER BY p.address.city")
	List<String> searchCities(@Param("query") String query);
}
