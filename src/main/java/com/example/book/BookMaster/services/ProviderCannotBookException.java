package com.example.book.BookMaster.services;

public class ProviderCannotBookException extends RuntimeException {
	private static final long serialVersionUID = -8779488273769574810L;

	public ProviderCannotBookException(String message) {
		super(message);
	}
}
