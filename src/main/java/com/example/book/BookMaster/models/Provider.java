package com.example.book.BookMaster.models;

import java.io.Serializable;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.lang.NonNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class Provider implements Serializable, IModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = 3719955439553165525L;

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID providerId;
	
	@Column(nullable = false)
	@NonNull()
	private String name;
	
	private String description;
	
	@Embedded
	private Address address;
	
	private String email;
	
	@Column(length = 10)
	private String phone;
	
	@Column
	@Enumerated(EnumType.STRING)
	private ProviderType type;
	
	private LocalTime startTime = LocalTime.of(9, 0);	// 09:00
	
	private LocalTime endTime = LocalTime.of(9, 0);	// 18:00
	
	private Integer timeBlockMinutes = 30;	//in minutes	
	
	@ElementCollection(fetch = FetchType.EAGER)
	@Enumerated(EnumType.STRING)
	@Column(name = "closed_day")
	private Set<DayOfWeek> closedDays = new HashSet<>();

	@ElementCollection(fetch = FetchType.EAGER)
	@Column(name = "closed_date")
	private Set<LocalDate> closedDates = new HashSet<>();

	@OneToMany(mappedBy = "provider", cascade = CascadeType.ALL)
    private Set<Service> services = new HashSet<>();

	@OneToOne
	@JsonIgnore
	private User user;

	/* Constructors */
    // Default constructor
	public Provider() {}
	
	public Provider(String name) {
		this.name = name;
	}
	
	public Provider(String name, User user) {
		this.name = name;
		this.user = user;
	}
	
	public Provider(String name, String description, Address address, String email, String phone, ProviderType type) {
		this.name = name;
		this.description = description;
		this.address = address;
		this.email = email;
		this.phone = phone;
		this.type = type;
	}

	public Provider(String name, String description, Address address, String email, String phone, ProviderType type,
			LocalTime startTime, LocalTime endTime, Integer timeBlockMinutes) {
		super();
		this.name = name;
		this.description = description;
		this.address = address;
		this.email = email;
		this.phone = phone;
		this.type = type;
		this.startTime = startTime;
		this.endTime = endTime;
		this.timeBlockMinutes = timeBlockMinutes;
	}

    /* Getters and setters */
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public ProviderType getType() {
		return type;
	}

	public void setType(ProviderType type) {
		this.type = type;
	}
	
	public Set<Service> getServices() {
		return services;
	}

	public void setServices(Set<Service> services) {
		this.services = services;
	}
	
	public void addService(Service service) {
		this.services.add(service);
		service.setProvider(this);
	}

	public UUID getProviderId() {
		return providerId;
	}
	
	public void setProviderId(UUID providerId) {
		this.providerId = providerId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	public LocalTime getStartTime() {
		return startTime != null ? startTime : LocalTime.of(9, 0);
	}

	public void setStartTime(LocalTime startTime) {
		this.startTime = startTime;
	}

	public LocalTime getEndTime() {
		return endTime != null ? endTime : LocalTime.of(18, 0);
	}

	public void setEndTime(LocalTime endTime) {
		this.endTime = endTime;
	}

	public Integer getTimeBlockMinutes() {
		return timeBlockMinutes != null ? timeBlockMinutes : 30;
	}

	public void setTimeBlockMinutes(Integer timeBlockMinutes) {
		this.timeBlockMinutes = timeBlockMinutes ;
	}

	public Set<DayOfWeek> getClosedDays() {
		return closedDays != null ? closedDays : new HashSet<>();
	}

	public void setClosedDays(Set<DayOfWeek> closedDays) {
		this.closedDays = closedDays != null ? new HashSet<>(closedDays) : new HashSet<>();
	}

	public Set<LocalDate> getClosedDates() {
		return closedDates != null ? closedDates : new HashSet<>();
	}

	public void setClosedDates(Set<LocalDate> closedDates) {
		this.closedDates = closedDates != null ? new HashSet<>(closedDates) : new HashSet<>();
	}
	
	@Override
	public String toString() {
		return "Provider [providerId=" + providerId + ", name=" + name + ", description=" + description + ", address="
				+ address + ", email=" + email + ", phone=" + phone + ", type=" + type + ", closedDays=" + closedDays
				+ ", closedDates=" + closedDates + "]";
	}
}
