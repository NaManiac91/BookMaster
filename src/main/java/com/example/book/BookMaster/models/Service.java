package com.example.book.BookMaster.models;

import java.io.Serializable;
import java.util.Arrays;
import java.util.UUID;

import org.springframework.lang.NonNull;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Service implements Serializable, IModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7227006511893711900L;

	@Id
	@GeneratedValue
	private UUID serviceId;
	
	@Column
	@NonNull()
	private String name;
	
	@Column
	private String description;
	
	@Column
	private String[] tags;
	
	@Column
	private Float price;
	
	@Column
	private Float time;	// in hour
	
	@ManyToOne
	@JsonBackReference
	private Provider provider;
	
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

	public String[] getTags() {
		return tags;
	}

	public void setTags(String[] tags) {
		this.tags = tags;
	}

	public Float getPrice() {
		return price;
	}

	public void setPrice(Float price) {
		this.price = price;
	}

	public Float getTime() {
		return time;
	}

	public void setTime(Float time) {
		this.time = time;
	}

	protected Service() {
		// TODO Auto-generated constructor stub
	}
	
	public Service(String name) {
		this.name = name;
	}
	
	public Service(String name, String description, String[] tags, Float price, Float time) {
		super();
		this.name = name;
		this.description = description;
		this.tags = tags;
		this.price = price;
		this.time = time;
	}

	@Override
	public String toString() {
		return "Service [serviceId=" + serviceId + ", name=" + name + ", description=" + description + ", tags="
				+ Arrays.toString(tags) + ", price=" + price + ", time=" + time + "]";
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
}
