package com.example.book.BookMaster.models;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.lang.NonNull;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_table")
public class User implements Serializable, IModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -8947498823029486036L;

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID userId;
	
	@Column(nullable = false)
	@NonNull()
	private String username;
	
	@Column(nullable = false)
	@NonNull()
	private String email;
	
	private String lastName;
	
	private String firstName;
	
	@ManyToMany(mappedBy = "users")
    private Set<Reservation> reservations = new HashSet<Reservation>();
	
	@OneToOne
	private Provider provider;
	
	/* Constructors */
    // Default constructor
	public User() {}
	
	public User(String username, String email) {
		this.username = username;
		this.email = email;
	}
	
	public User(String username, String lastName, String firstName, String email) {
		this.username = username;
		this.lastName = lastName;
		this.firstName = firstName;
		this.email = email;
	}
	
	public User(String username, String lastName, String firstName, String email, Provider provider) {
		this.username = username;
		this.lastName = lastName;
		this.firstName = firstName;
		this.email = email;
		this.provider = provider;
	}

	/* Getters and setters */
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public Set<Reservation> getReservations() {
		return reservations;
	}

	public void setReservations(Set<Reservation> reservations) {
		this.reservations = reservations;
	}
	
	public void addReservation(Reservation reservation) {
		this.reservations.add(reservation);
	}

	public Provider getProvider() {
		return provider;
	}

	public void setProvider(Provider provider) {
		this.provider = provider;
	}

	public UUID getUserId() {
		return userId;
	}

	public void setUserId(UUID userId) {
		this.userId = userId;
	}
	
	@Override
	public String toString() {
		return "User [userId=" + userId + ", username=" + username + ", lastName=" + lastName + ", firstName="
				+ firstName + ", email=" + email + "]";
	}
}
