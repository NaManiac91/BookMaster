package com.example.book.BookMaster.models;

import org.springframework.lang.NonNull;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Address {
	@Column(nullable = false)
	@NonNull()
    private String street;
    
	@Column(nullable = false)
	@NonNull()
	private String city;
    
    @Column(length = 10)
    private String postalCode;
    
	@Column(nullable = false)
	@NonNull()
    private String country;

	/* Constructors */
    // Default constructor
    public Address() {}

    public Address(String street, String city, String postalCode, String country) {
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.country = country;
    }

    /* Getters and setters */
    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
