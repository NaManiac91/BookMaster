package com.example.book.BookMaster.services;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TranslationBootstrapService implements CommandLineRunner {
	private TranslationService translationService;

	public TranslationBootstrapService(TranslationService translationService) {
		this.translationService = translationService;
	}

	@Override
	public void run(String... args) throws Exception {
		this.translationService.seedDefaultsIfMissing();
	}
}
