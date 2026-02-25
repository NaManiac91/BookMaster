package com.example.book.BookMaster.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.book.BookMaster.models.Language;
import com.example.book.BookMaster.models.Translation;
import com.example.book.BookMaster.testing.FunctionalTestSupport;
import com.example.book.BookMaster.web.DTO.TranslationDto;
import com.example.book.BookMaster.web.DTO.UpsertTranslationRequest;

class TranslationServiceFunctionalTest extends FunctionalTestSupport {

    @Autowired
    private TranslationService translationService;

    @Test
    void translateShouldFallbackToEnglishWhenSpecificLanguageIsMissing() {
        String key = "test.fallback." + UUID.randomUUID();
        this.translationRepo.save(new Translation(key, Language.EN, "English Value"));

        String translated = this.translationService.translate(key, Language.IT);

        assertEquals("English Value", translated);
    }

    @Test
    void getTranslationsForLanguageShouldMergeDefaultAndLocalizedValues() {
        String keyOverride = "test.merge.override." + UUID.randomUUID();
        String keyDefaultOnly = "test.merge.default." + UUID.randomUUID();

        this.translationRepo.save(new Translation(keyOverride, Language.EN, "Default"));
        this.translationRepo.save(new Translation(keyOverride, Language.IT, "Localizzato"));
        this.translationRepo.save(new Translation(keyDefaultOnly, Language.EN, "Only Default"));

        Map<String, String> translations = this.translationService.getTranslationsForLanguage("it");

        assertEquals("Localizzato", translations.get(keyOverride));
        assertEquals("Only Default", translations.get(keyDefaultOnly));
    }

    @Test
    void upsertShouldCreateThenUpdateSameTranslation() {
        String key = "test.upsert." + UUID.randomUUID();

        UpsertTranslationRequest request = new UpsertTranslationRequest();
        request.key = key;
        request.language = "fr";
        request.value = "Bonjour";

        TranslationDto created = this.translationService.upsert(request);
        assertEquals("Bonjour", created.value);

        request.value = "Salut";
        TranslationDto updated = this.translationService.upsert(request);
        assertEquals("Salut", updated.value);
        assertEquals("Salut",
                this.translationRepo.findByKeyAndLanguage(key, Language.FR).orElseThrow().getValue());
    }

    @Test
    void upsertShouldRejectInvalidPayload() {
        assertThrows(IllegalArgumentException.class, () -> this.translationService.upsert(new UpsertTranslationRequest()));
    }
}
