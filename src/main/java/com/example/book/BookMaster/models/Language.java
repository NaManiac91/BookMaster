package com.example.book.BookMaster.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Language {
	EN("en"),
	IT("it"),
	FR("fr");

	private final String code;

	Language(String code) {
		this.code = code;
	}

	@JsonValue
	public String getCode() {
		return this.code;
	}

	@JsonCreator
	public static Language fromValue(String value) {
		if (value == null || value.isBlank()) {
			return EN;
		}

		for (Language language : values()) {
			if (language.code.equalsIgnoreCase(value) || language.name().equalsIgnoreCase(value)) {
				return language;
			}
		}

		return EN;
	}
}
