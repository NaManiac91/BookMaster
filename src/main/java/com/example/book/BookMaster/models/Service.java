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
	private Integer time;	// in number of slots ex 1, 2, ...
	
	@ManyToOne
	@JsonIgnore
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

	public Integer getTime() {
		return time;
	}

	public void setTime(Integer time) {
		this.time = time;
	}

	public Service() {
		// TODO Auto-generated constructor stub
	}
	
	public Service(String name) {
		this.name = name;
	}
	
	public Service(String name, String description, String[] tags, Float price, int time) {
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
				+ tags.toString() + ", price=" + price + ", time=" + time + "]";
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
}
