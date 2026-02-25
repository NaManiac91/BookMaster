package com.example.book.BookMaster.models;

import java.io.Serializable;
import java.util.LinkedHashSet;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.lang.NonNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Transient;

@Entity
public class Reservation implements Serializable, IModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2884993227154328339L;
	
	@Id
    @GeneratedValue(strategy = GenerationType.UUID)
	private UUID reservationId;
	
	@Column(nullable = false)
	@NonNull()
	private LocalDate date = LocalDate.now();

	@Column(nullable = false, length = 255)
	@NonNull()
    private String slots = "09:00";		//	list of slots in this format "09:00", "10:00"

	@ManyToMany
    @JoinTable(
        name = "user_reservation",
        joinColumns = @JoinColumn(name = "reservation_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
	@JsonIgnore
    private Set<User> users;
	
	@Column(nullable = false)
	@NonNull()
	private UUID serviceId;
	
	@Column(nullable = false)
	@NonNull()
	private UUID providerId;
	
	private String note;
	
	/* Support fields */
	@Transient
	private Service service;
	@Transient
	@JsonIgnore
	private Provider provider;
	
	/* Constructors */
    // Default constructor
	public Reservation() {}
	
	public Reservation(LocalDate date, String slots, UUID serviceId, UUID providerId, String note) {
		this.date = date;
		this.slots = slots;
		this.serviceId = serviceId;
		this.providerId = providerId;
		this.note = note;
	}
	
	public Reservation(LocalDate date, String slots, User consumer, User provider, UUID serviceId, UUID providerId, String note) {
		this.date = date;
		this.slots = slots;
		Set<User> participants = new LinkedHashSet<>();
		participants.add(consumer);
		participants.add(provider);
		this.users = participants;
		this.serviceId = serviceId;
		this.providerId = providerId;
		this.note = note;
	}

    /* Getters and setters */
	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public UUID getReservationId() {
		return reservationId;
	}
	
	public void setReservationId(UUID reservationId) {
		this.reservationId = reservationId;
	}
	
	public String getSlots() {
		return slots;
	}

	public void setSlots(String slots) {
		this.slots = slots;
	}
	
	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}
	
	public UUID getProviderId() {
		return providerId;
	}

	public void setProviderId(UUID providerId) {
		this.providerId = providerId;
	}
	
    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

	public UUID getServiceId() {
		return serviceId;
	}

	public void setServiceId(UUID serviceId) {
		this.serviceId = serviceId;
	}

	public Service getService() {
		return service;
	}

	public void setService(Service service) {
		this.service = service;
	}
	
	public Provider getProvider() {
		return provider;
	}

	public void setProvider(Provider provider) {
		this.provider = provider;
	}

	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	public List<String> getListSlot() {
		return List.of(this.getSlots().split(","));
	}
	
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	public String getProviderName() {
		return this.getProvider() != null ? this.getProvider().getName() : null;
	}
	
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	public Integer getProviderTimeBlockMinutes() {
		return this.getProvider() != null ? this.getProvider().getTimeBlockMinutes() : null;
	}

	@Override
	public String toString() {
		return "Reservation [reservationId=" + reservationId + ", date=" + date + ", slots=" + slots + ", users="
				+ users + ", serviceId=" + serviceId + ", providerId=" + providerId + ", note=" + note + "]";
	}
}
