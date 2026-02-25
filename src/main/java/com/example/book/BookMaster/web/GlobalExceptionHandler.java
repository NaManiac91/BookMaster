package com.example.book.BookMaster.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.book.BookMaster.services.ProviderCannotBookException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<String> handleNoResourceFound(NoResourceFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body("Resource not found: " + ex.getResourcePath());
    }

	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> handleException(Exception ex) {
	    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                         .body("An internal server error occurred: " + ex.getMessage());
	}

	@ExceptionHandler(ProviderCannotBookException.class)
	public ResponseEntity<String> handleProviderCannotBookException(ProviderCannotBookException ex) {
	    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
	}
}
