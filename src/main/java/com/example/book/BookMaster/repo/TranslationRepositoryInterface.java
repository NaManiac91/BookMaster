package com.example.book.BookMaster.repo;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.book.BookMaster.models.Language;
import com.example.book.BookMaster.models.Translation;

@RepositoryRestResource(exported = false)
public interface TranslationRepositoryInterface extends CrudRepository<Translation, UUID> {
	@RestResource(exported = false)
	List<Translation> findByLanguage(Language language);

	@RestResource(exported = false)
	Optional<Translation> findByKeyAndLanguage(String key, Language language);
}
