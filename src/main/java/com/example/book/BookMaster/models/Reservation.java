package com.example.book.BookMaster.models;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.lang.NonNull;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Reservation implements Serializable, IModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2884993227154328339L;
	
	@Id
    @GeneratedValue(strategy = GenerationType.UUID)
	private UUID reservationId;
	
	@Column()
	@NonNull()
	private LocalDate date;

	@Column
	@NonNull()
    private String slots;		//	list of slots in this format ["09:00", "10:00"]

	@ManyToOne
	@JoinColumn(name = "user_id")
	@JsonBackReference("userId")
	private User user;
	
	@ManyToOne
	@JoinColumn(name = "service_id")
	@JsonBackReference("serviceId")
	private Service service;
	
	private UUID providerId;
	
	@Column
	private String note;
	
	public Reservation() {
		// TODO Auto-generated constructor stub
	}
	
	public Reservation(LocalDate date, String slots, UUID providerId, String note) {
		this.date = date;
		this.slots = slots;
		this.providerId = providerId;
		this.note = note;
	}

	public Reservation(String slots, User user, Service service, UUID providerId, String note) {
		this.slots = slots;
		this.user = user;
		this.service = service;
		this.providerId = providerId;
		this.note = note;
	}

	public User getUser() {
		return user;
	}

	public Service getService() {
		return service;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public void setService(Service service) {
		this.service = service;
	}

	@Override
	public String toString() {
		return "Reservation [reservationId=" + reservationId + ", slots=" + this.slots +
				", user=" + user + ", service=" + service + ", note=" + note + "]";
	}

	public UUID getReservationId() {
		return reservationId;
	}
	
	public void setReservationId(UUID reservationId) {
		this.reservationId = reservationId;
	}
	
	public String getSlots() {
		return slots != null ? slots : "09:00,12:00";
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
	
	public List<String> getListSlot() {
		return Arrays.asList(this.getSlots().split(","));
	}
	
	public String getProviderName() {
		return this.getService().getProvider().getName();
	}
	
	public String getServiceName() {
		return this.getService().getName();
	}
}
