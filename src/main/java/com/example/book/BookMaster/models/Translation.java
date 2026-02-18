package com.example.book.BookMaster.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "translation", uniqueConstraints = {
		@UniqueConstraint(name = "uk_translation_key_language", columnNames = {"translation_key", "language"})
})
public class Translation implements Serializable, IModel {
	private static final long serialVersionUID = 2694910578058910184L;

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID translationId;

	@Column(name = "translation_key", nullable = false, length = 150)
	private String key;

	@Column(nullable = false, length = 5)
	@Enumerated(EnumType.STRING)
	private Language language;

	@Column(name = "translation_value", nullable = false, length = 2000)
	private String translationValue;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	@Column(nullable = false)
	private LocalDateTime updatedAt;

	public Translation() {
	}

	public Translation(String key, Language language, String value) {
		this.key = key;
		this.language = language;
		this.translationValue = value;
	}

	@PrePersist
	public void prePersist() {
		LocalDateTime now = LocalDateTime.now();
		if (this.createdAt == null) {
			this.createdAt = now;
		}
		this.updatedAt = now;
	}

	@PreUpdate
	public void preUpdate() {
		this.updatedAt = LocalDateTime.now();
	}

	public UUID getTranslationId() {
		return translationId;
	}

	public void setTranslationId(UUID translationId) {
		this.translationId = translationId;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Language getLanguage() {
		return language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public String getValue() {
		return translationValue;
	}

	public void setValue(String value) {
		this.translationValue = value;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}
