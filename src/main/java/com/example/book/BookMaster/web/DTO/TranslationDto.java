package com.example.book.BookMaster.web.DTO;

public class TranslationDto {
	public String key;
	public String language;
	public String value;

	public TranslationDto() {
	}

	public TranslationDto(String key, String language, String value) {
		this.key = key;
		this.language = language;
		this.value = value;
	}
}
