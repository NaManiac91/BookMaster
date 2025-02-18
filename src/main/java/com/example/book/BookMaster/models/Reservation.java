package com.example.book.BookMaster.models;

import java.io.Serializable;
import java.util.Date;
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
import jakarta.persistence.OneToOne;

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
	private Date date;
	
	@ManyToOne
	@JoinColumn(name = "user_user_id")
	@JsonBackReference
	private User user;
	
	@OneToOne
	@NonNull()
	private Service service;
	
	@Column
	private String note;
	
	private String providerName;
	
	public Reservation() {
		// TODO Auto-generated constructor stub
	}

	public Reservation(Date date, User user, Service service, String note) {
		this.date = date;
		this.user = user;
		this.service = service;
		this.note = note;
	}

	public User getUser() {
		return user;
	}

	public Service getService() {
		return service;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
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
		return "Reservation [reservationId=" + reservationId + ", date=" + date + ", user=" + user + ", service=" + service
				+ ", note=" + note + "]";
	}

	public UUID getReservationId() {
		return reservationId;
	}
	

	public String getProviderName() {
		return providerName;
	}

	public void setProviderName(String providerName) {
		this.providerName = providerName;
	}

	public void fillProviderName() {
		this.providerName = this.getService().getProvider().getName();
	}
}
