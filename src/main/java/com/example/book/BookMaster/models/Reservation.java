package com.example.book.BookMaster.models;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.lang.NonNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;

@Entity
public class Reservation implements Serializable, IModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2884993227154328339L;
	
	@Id
    @GeneratedValue(strategy = GenerationType.UUID)
	private UUID reservationId;
	
	@Column
	@NonNull()
	private LocalDate date = LocalDate.now();

	@Column
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
	
	@Column
	@NonNull()
	private UUID serviceId;
	
	@Column
	@NonNull()
	private UUID providerId;
	
	@Column
	private String note;
	
	/* Support fields */
	private Service service;
	@JsonIgnore
	private Provider provider;
	
	public Reservation() {
		// TODO Auto-generated constructor stub
	}
	
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
		this.users = Set.of(consumer, provider);
		this.serviceId = serviceId;
		this.providerId = providerId;
		this.note = note;
	}

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

	public List<String> getListSlot() {
		return List.of(this.getSlots().split(","));
	}
	
	public String getProviderName() {
		return this.getProvider().getName();
	}

	@Override
	public String toString() {
		return "Reservation [reservationId=" + reservationId + ", date=" + date + ", slots=" + slots + ", users="
				+ users + ", serviceId=" + serviceId + ", providerId=" + providerId + ", note=" + note + "]";
	}
}
