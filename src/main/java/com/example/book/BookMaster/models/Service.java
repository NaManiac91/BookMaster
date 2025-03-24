package com.example.book.BookMaster.models;

import java.io.Serializable;
import java.util.UUID;

import org.springframework.lang.NonNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Service implements Serializable, IModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7227006511893711900L;

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID serviceId;
	
	@Column(nullable = false)
	@NonNull()
	private String name;
	
	private String description;
		
	private Float price;
	
	private Integer time;	// in number of slots ex 1, 2, ...
	
	@ManyToOne
	@JsonIgnore
	private Provider provider;
	
	/* Constructors */
    // Default constructor
	public Service() {}
	
	public Service(String name) {
		this.name = name;
	}
	
	public Service(String name, String description, Float price, int time) {
		super();
		this.name = name;
		this.description = description;
		this.price = price;
		this.time = time;
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

	public Float getPrice() {
		return price;
	}

	public void setPrice(Float price) {
		this.price = price;
	}

	public Integer getTime() {
		return time;
	}

	public void setTime(Integer time) {
		this.time = time;
	}

	public Provider getProvider() {
		return provider;
	}

	public void setProvider(Provider provider) {
		this.provider = provider;
	}

	public UUID getServiceId() {
		return serviceId;
	}

	public void setServiceId(UUID serviceId) {
		this.serviceId = serviceId;
	}
	
	@Override
	public String toString() {
		return "Service [serviceId=" + serviceId + ", name=" + name + ", description=" + description + ", price=" + price + ", time=" + time + "]";
	}
}
