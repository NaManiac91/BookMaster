package com.example.book.BookMaster.services;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.example.book.BookMaster.models.Language;
import com.example.book.BookMaster.models.Translation;
import com.example.book.BookMaster.repo.TranslationRepositoryInterface;
import com.example.book.BookMaster.web.DTO.TranslationDto;
import com.example.book.BookMaster.web.DTO.UpsertTranslationRequest;

@Service
public class TranslationService {
	private static final Logger logger = LogManager.getLogger(TranslationService.class);

	private TranslationRepositoryInterface translationRepo;

	public TranslationService(TranslationRepositoryInterface translationRepo) {
		this.translationRepo = translationRepo;
	}

	public Map<String, String> getTranslationsForLanguage(String languageCode) {
		Language language = Language.fromValue(languageCode);
		Map<String, String> english = this.toMap(this.translationRepo.findByLanguage(Language.EN));
		if (language == Language.EN) {
			return english;
		}

		Map<String, String> selected = this.toMap(this.translationRepo.findByLanguage(language));
		Map<String, String> merged = new LinkedHashMap<>(english);
		merged.putAll(selected);
		return merged;
	}

	public String translate(String key, Language preferredLanguage) {
		Language language = preferredLanguage == null ? Language.EN : preferredLanguage;
		if (key == null || key.isBlank()) {
			return "";
		}

		return this.translationRepo.findByKeyAndLanguage(key, language)
				.map(Translation::getValue)
				.or(() -> this.translationRepo.findByKeyAndLanguage(key, Language.EN).map(Translation::getValue))
				.orElse(key);
	}

	public List<TranslationDto> getTranslations(Language language) {
		Language target = language == null ? Language.EN : language;
		List<Translation> translations = this.translationRepo.findByLanguage(target);
		List<TranslationDto> response = new ArrayList<>();
		for (Translation translation : translations) {
			response.add(new TranslationDto(
					translation.getKey(),
					translation.getLanguage().getCode(),
					translation.getValue()));
		}
		return response;
	}

	public TranslationDto upsert(UpsertTranslationRequest request) {
		if (request == null || request.key == null || request.key.isBlank() || request.value == null) {
			throw new IllegalArgumentException("Invalid translation payload");
		}

		Language language = Language.fromValue(request.language);
		Translation entity = this.translationRepo.findByKeyAndLanguage(request.key, language)
				.orElse(new Translation(request.key, language, request.value));
		entity.setValue(request.value);

		Translation saved = this.translationRepo.save(entity);
		return new TranslationDto(saved.getKey(), saved.getLanguage().getCode(), saved.getValue());
	}

	public void seedDefaultsIfMissing() {
		List<TranslationSeed> seeds = this.defaultSeeds();
		int inserted = 0;

		for (TranslationSeed seed : seeds) {
			inserted += this.insertIfMissing(seed.key(), Language.EN, seed.en()) ? 1 : 0;
			inserted += this.insertIfMissing(seed.key(), Language.IT, seed.it()) ? 1 : 0;
			inserted += this.insertIfMissing(seed.key(), Language.FR, seed.fr()) ? 1 : 0;
		}

		if (inserted > 0) {
			logger.info("Translation bootstrap completed. Inserted {} rows", inserted);
		}
	}

	private boolean insertIfMissing(String key, Language language, String value) {
		if (value == null) {
			return false;
		}

		if (this.translationRepo.findByKeyAndLanguage(key, language).isPresent()) {
			return false;
		}

		this.translationRepo.save(new Translation(key, language, value));
		return true;
	}

	private Map<String, String> toMap(List<Translation> translations) {
		Map<String, String> map = new LinkedHashMap<>();
		for (Translation translation : translations) {
			map.put(translation.getKey(), translation.getValue());
		}
		return map;
	}

	private List<TranslationSeed> defaultSeeds() {
		return List.of(
				new TranslationSeed("menu.home", "Home", "Home", "Accueil"),
				new TranslationSeed("menu.providers", "Providers", "Provider", "Prestataires"),
				new TranslationSeed("menu.history", "History", "Storico", "Historique"),

				new TranslationSeed("common.cancel", "Cancel", "Annulla", "Annuler"),
				new TranslationSeed("common.save", "Save", "Salva", "Enregistrer"),
				new TranslationSeed("common.ok", "OK", "OK", "OK"),
				new TranslationSeed("common.minutesShort", "m", "m", "min"),
				new TranslationSeed("common.all", "All", "Tutte", "Tous"),
				new TranslationSeed("common.avatarAlt", "User avatar", "Avatar utente", "Avatar utilisateur"),
				new TranslationSeed("loading.pleaseWait", "Please wait...", "Attendere...", "Veuillez patienter..."),
				new TranslationSeed("error.undefinedClientError", "Undefined client error", "Errore client non definito", "Erreur client non definie"),

				new TranslationSeed("auth.appTitle", "Book Master", "Book Master", "Book Master"),
				new TranslationSeed("auth.username", "Username", "Username", "Nom d'utilisateur"),
				new TranslationSeed("auth.password", "Password", "Password", "Mot de passe"),
				new TranslationSeed("auth.enterUsername", "Enter username", "Inserisci username", "Entrez le nom d'utilisateur"),
				new TranslationSeed("auth.enterPassword", "Enter password", "Inserisci password", "Entrez le mot de passe"),
				new TranslationSeed("auth.signUp", "Sign up", "Registrati", "S'inscrire"),
				new TranslationSeed("auth.login", "Login", "Accedi", "Connexion"),
				new TranslationSeed("auth.loginWithGoogle", "Login with Google", "Accedi con Google", "Connexion avec Google"),
				new TranslationSeed("auth.completingLogin", "Completing login...", "Completamento accesso...", "Connexion en cours..."),
				new TranslationSeed("auth.forcePasswordChangeMessage", "For security, you must change the default password before continuing.", "Per sicurezza devi cambiare la password di default prima di continuare.", "Pour des raisons de securite, vous devez changer le mot de passe par defaut avant de continuer."),
				new TranslationSeed("auth.newPassword", "New password", "Nuova password", "Nouveau mot de passe"),
				new TranslationSeed("auth.enterNewPassword", "Enter new password", "Inserisci nuova password", "Entrez un nouveau mot de passe"),
				new TranslationSeed("auth.confirmNewPassword", "Confirm new password", "Conferma nuova password", "Confirmez le nouveau mot de passe"),
				new TranslationSeed("auth.updatePassword", "Update password", "Aggiorna password", "Mettre a jour le mot de passe"),

				new TranslationSeed("home.welcome", "Welcome {{username}}", "Benvenuto {{username}}", "Bienvenue {{username}}"),
				new TranslationSeed("home.findProviderOrService", "Find Provider or Service", "Trova Provider o Servizio", "Trouver un prestataire ou un service"),
				new TranslationSeed("home.segment.provider", "Provider", "Provider", "Prestataire"),
				new TranslationSeed("home.segment.service", "Service", "Servizio", "Service"),
				new TranslationSeed("home.searchPlaceholder", "Search by provider or service", "Cerca per provider o servizio", "Rechercher par prestataire ou service"),
				new TranslationSeed("home.cityFilterPlaceholder", "Filter by city (e.g. Naples)", "Filtra per citta (es. Napoli)", "Filtrer par ville (ex. Naples)"),
				new TranslationSeed("home.selectCityHint", "Select a city from the list to apply the filter.", "Seleziona una citta dalla lista per applicare il filtro.", "Selectionnez une ville de la liste pour appliquer le filtre."),
					new TranslationSeed("home.servicesAvailable", "{{count}} services available", "{{count}} servizi disponibili", "{{count}} services disponibles"),
					new TranslationSeed("home.book", "Book", "Prenota", "Reserver"),
					new TranslationSeed("home.searching", "Searching...", "Ricerca in corso...", "Recherche en cours..."),
					new TranslationSeed("home.noResults", "No provider or service found.", "Nessun provider o servizio trovato.", "Aucun prestataire ou service trouve."),
					new TranslationSeed("home.adminArea", "Admin Area", "Area Admin", "Espace admin"),
					new TranslationSeed("home.role.provider", "Provider mode", "Modalita provider", "Mode prestataire"),
					new TranslationSeed("home.role.customer", "Customer mode", "Modalita cliente", "Mode client"),

				new TranslationSeed("providerAdmin.editProfile", "Edit Profile", "Modifica Profilo", "Modifier le profil"),
				new TranslationSeed("providerAdmin.createService", "Create Service", "Crea Servizio", "Creer un service"),
				new TranslationSeed("providerAdmin.onlyProviders", "This section is available for provider users only.", "Questa sezione e disponibile solo per utenti provider.", "Cette section est disponible uniquement pour les utilisateurs prestataires."),

				new TranslationSeed("reservationHistory.title", "Reservation History", "Storico Prenotazioni", "Historique des reservations"),
				new TranslationSeed("reservationHistory.empty", "No past reservations.", "Nessuna prenotazione passata.", "Aucune reservation passee."),

				new TranslationSeed("reservationWorkflow.step.provider", "Provider", "Provider", "Prestataire"),
				new TranslationSeed("reservationWorkflow.step.service", "Available Services", "Lista dei Servizi Disponibili", "Services disponibles"),
				new TranslationSeed("reservationWorkflow.step.slots", "Time Slots", "Orari", "Horaires"),
				new TranslationSeed("reservationWorkflow.step.summary", "Reservation Summary", "Riepilogo Prenotazione", "Recapitulatif de reservation"),
					new TranslationSeed("reservationWorkflow.previousStepAria", "Previous step", "Step precedente", "Etape precedente"),
					new TranslationSeed("reservationWorkflow.previousMonthAria", "Previous month", "Mese precedente", "Mois precedent"),
					new TranslationSeed("reservationWorkflow.nextMonthAria", "Next month", "Mese successivo", "Mois suivant"),
					new TranslationSeed("reservationWorkflow.confirmBooking", "Confirm reservation", "Conferma prenotazione", "Confirmer la reservation"),
					new TranslationSeed("reservationWorkflow.insufficientSlots", "There are not enough consecutive slots available for this service duration.", "Gli slot consecutivi disponibili non sono sufficienti per la durata del servizio.", "Les creneaux consecutifs disponibles ne sont pas suffisants pour la duree du service."),
					new TranslationSeed("reservationWorkflow.closedDaysInfo", "Closed days: {{days}}", "Giorni di chiusura: {{days}}", "Jours de fermeture: {{days}}"),
					new TranslationSeed("reservationWorkflow.closedDatesInfo", "Closed specific dates: {{dates}}", "Date di chiusura specifiche: {{dates}}", "Dates de fermeture specifiques: {{dates}}"),
					new TranslationSeed("reservationWorkflow.onlyCustomers", "Booking is available for customer users only.", "La prenotazione e disponibile solo per utenti customer.", "La reservation est disponible uniquement pour les utilisateurs clients."),

				new TranslationSeed("providersList.title", "Our partners", "I nostri partners", "Nos partenaires"),
				new TranslationSeed("providersList.searchPlaceholder", "Search provider or service", "Cerca provider o servizio", "Rechercher prestataire ou service"),
				new TranslationSeed("providersList.cityPlaceholder", "Filter by city", "Filtra per citta", "Filtrer par ville"),
				new TranslationSeed("providersList.typeLabel", "Type", "Tipologia", "Type"),
				new TranslationSeed("providersList.allTypes", "All", "Tutte", "Tous"),
				new TranslationSeed("providersList.empty", "No provider found.", "Nessun provider trovato.", "Aucun prestataire trouve."),

				new TranslationSeed("provider.openInGoogleMaps", "Open in Google Maps", "Apri in Google Maps", "Ouvrir dans Google Maps"),

				new TranslationSeed("service.name", "Name", "Nome", "Nom"),
				new TranslationSeed("service.description", "Description", "Descrizione", "Description"),
				new TranslationSeed("service.price", "Price", "Prezzo", "Prix"),
				new TranslationSeed("service.time", "Time", "Durata", "Duree"),
				new TranslationSeed("service.removedSuccess", "Service removed successfully.", "Servizio rimosso con successo.", "Service supprime avec succes."),

				new TranslationSeed("provider.name", "Name", "Nome", "Nom"),
				new TranslationSeed("provider.description", "Description", "Descrizione", "Description"),
				new TranslationSeed("provider.type", "Type", "Tipo", "Type"),
				new TranslationSeed("provider.phone", "Phone", "Telefono", "Telephone"),
				new TranslationSeed("provider.email", "Email", "Email", "Email"),
				new TranslationSeed("provider.streetAddress", "Street Address", "Indirizzo", "Adresse"),
				new TranslationSeed("provider.city", "City", "Citta", "Ville"),
				new TranslationSeed("provider.postalCode", "Postal Code", "CAP", "Code postal"),
				new TranslationSeed("provider.country", "Country", "Paese", "Pays"),
				new TranslationSeed("provider.startTime", "Start Time", "Orario Inizio", "Heure debut"),
				new TranslationSeed("provider.endTime", "End Time", "Orario Fine", "Heure fin"),
				new TranslationSeed("provider.timeBlockMinutes", "Time Block (minutes)", "Blocco Temporale (minuti)", "Bloc de temps (minutes)"),
				new TranslationSeed("provider.closedDays", "Closed Days", "Giorni di chiusura", "Jours de fermeture"),
				new TranslationSeed("provider.closedDaysPlaceholder", "Select weekly closing days", "Seleziona i giorni di chiusura settimanali", "Selectionnez les jours de fermeture hebdomadaire"),
				new TranslationSeed("provider.closedDates", "Closed Dates", "Date di chiusura", "Dates de fermeture"),
				new TranslationSeed("provider.closedDatesPlaceholder", "Select a date", "Seleziona una data", "Selectionnez une date"),
				new TranslationSeed("provider.addClosedDate", "Add date", "Aggiungi data", "Ajouter une date"),

				new TranslationSeed("reservation.provider", "Provider", "Provider", "Prestataire"),
				new TranslationSeed("reservation.service", "Service", "Servizio", "Service"),
				new TranslationSeed("reservation.date", "Date", "Data", "Date"),
				new TranslationSeed("reservation.time", "Time", "Orario", "Heure"),
				new TranslationSeed("reservation.duration", "Duration", "Durata", "Duree"),
				new TranslationSeed("reservation.price", "Price", "Prezzo", "Prix"),
				new TranslationSeed("reservation.notes", "Notes", "Note", "Notes"),
				new TranslationSeed("reservation.addNote", "Add note", "Aggiungi Nota", "Ajouter une note"),

				new TranslationSeed("reservations.futureTitle", "Upcoming Reservations", "Prenotazioni Future", "Reservations a venir"),
				new TranslationSeed("reservations.emptyFuture", "No upcoming reservations.", "Nessuna prenotazione futura.", "Aucune reservation a venir."),
				new TranslationSeed("reservations.removedSuccess", "Reservation removed successfully.", "Prenotazione rimossa con successo.", "Reservation supprimee avec succes."),

				new TranslationSeed("user.username", "Username", "Username", "Nom d'utilisateur"),
				new TranslationSeed("user.email", "Email", "Email", "Email"),
				new TranslationSeed("user.isProvider", "Is Provider", "E Provider", "Est prestataire"),
				new TranslationSeed("user.language", "Language", "Lingua", "Langue"),
				new TranslationSeed("user.servicesTitle", "Services", "Servizi", "Services"),
				new TranslationSeed("user.providersTitle", "Providers", "Provider", "Prestataires"),

				new TranslationSeed("language.english", "English", "Inglese", "Anglais"),
				new TranslationSeed("language.italian", "Italian", "Italiano", "Italien"),
				new TranslationSeed("language.french", "French", "Francese", "Francais"),

				new TranslationSeed("editor.save", "Save", "Salva", "Enregistrer"),
				new TranslationSeed("editor.title.create.user", "Create User", "Crea Utente", "Creer utilisateur"),
				new TranslationSeed("editor.title.create.provider", "Create Provider", "Crea Provider", "Creer prestataire"),
				new TranslationSeed("editor.title.create.service", "Create Service", "Crea Servizio", "Creer service"),
				new TranslationSeed("editor.title.create.reservation", "Create Reservation", "Crea Prenotazione", "Creer reservation"),
				new TranslationSeed("editor.title.create.imodel", "Create", "Crea", "Creer"),
				new TranslationSeed("editor.title.edit.user", "Edit User", "Modifica Utente", "Modifier utilisateur"),
				new TranslationSeed("editor.title.edit.provider", "Edit Provider", "Modifica Provider", "Modifier prestataire"),
				new TranslationSeed("editor.title.edit.service", "Edit Service", "Modifica Servizio", "Modifier service"),
				new TranslationSeed("editor.title.edit.reservation", "Edit Reservation", "Modifica Prenotazione", "Modifier reservation"),
				new TranslationSeed("editor.title.edit.imodel", "Edit", "Modifica", "Modifier"),
				new TranslationSeed("editor.title.consult.user", "User Details", "Dettaglio Utente", "Details utilisateur"),
				new TranslationSeed("editor.title.consult.provider", "Provider Details", "Dettaglio Provider", "Details prestataire"),
				new TranslationSeed("editor.title.consult.service", "Service Details", "Dettaglio Servizio", "Details service"),
				new TranslationSeed("editor.title.consult.reservation", "Reservation Details", "Dettaglio Prenotazione", "Details reservation"),
				new TranslationSeed("editor.title.consult.imodel", "Details", "Dettagli", "Details"),

				new TranslationSeed("provider.type.HEALTHCARE", "Healthcare", "Sanita", "Sante"),
				new TranslationSeed("provider.type.BEAUTY_AND_PERSONAL_CARE", "Beauty and Personal Care", "Bellezza e Cura Personale", "Beaute et soins personnels"),
				new TranslationSeed("provider.type.HOME_SERVICES", "Home Services", "Servizi per la Casa", "Services a domicile"),
				new TranslationSeed("provider.type.FITNESS_AND_WELLNESS", "Fitness and Wellness", "Fitness e Benessere", "Fitness et bien-etre"),
				new TranslationSeed("provider.type.EVENT_PLANNING_AND_ENTERTAINMENT", "Event Planning and Entertainment", "Organizzazione Eventi e Intrattenimento", "Planification d'evenements et divertissement"),
				new TranslationSeed("provider.type.AUTOMOTIVE_SERVICES", "Automotive Services", "Servizi Automotive", "Services automobiles"),
				new TranslationSeed("provider.type.EDUCATION_AND_TUTORING", "Education and Tutoring", "Istruzione e Tutoraggio", "Education et soutien scolaire"),
				new TranslationSeed("provider.type.TRAVEL_AND_LEISURE", "Travel and Leisure", "Viaggi e Tempo Libero", "Voyage et loisirs"),
				new TranslationSeed("provider.type.LEGAL_AND_FINANCIAL_SERVICES", "Legal and Financial Services", "Servizi Legali e Finanziari", "Services juridiques et financiers"),
				new TranslationSeed("provider.type.FOOD_AND_DRINK", "Food and Drink", "Cibo e Bevande", "Alimentation et boissons"),
				new TranslationSeed("provider.type.PHOTOGRAPHY_AND_VIDEOGRAPHY", "Photography and Videography", "Fotografia e Videografia", "Photographie et videographie"),
				new TranslationSeed("weekday.mon", "Mon", "Lun", "Lun"),
				new TranslationSeed("weekday.tue", "Tue", "Mar", "Mar"),
				new TranslationSeed("weekday.wed", "Wed", "Mer", "Mer"),
				new TranslationSeed("weekday.thu", "Thu", "Gio", "Jeu"),
				new TranslationSeed("weekday.fri", "Fri", "Ven", "Ven"),
				new TranslationSeed("weekday.sat", "Sat", "Sab", "Sam"),
				new TranslationSeed("weekday.sun", "Sun", "Dom", "Dim")
		);
	}

	private record TranslationSeed(String key, String en, String it, String fr) {
	}
}
