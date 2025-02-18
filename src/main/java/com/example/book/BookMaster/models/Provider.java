package com.example.book.BookMaster.models;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.lang.NonNull;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
	
	@Column
	@NonNull()
	private String name;
	
	@Column
	private String description;
	
	@Column
	private String address;
	
	@Column
	private String email;
	
	@Column
	private String phone;
	
	@Column
	private String type;
	
	@OneToMany(mappedBy = "provider", cascade = CascadeType.ALL)
	@JsonManagedReference
    private Set<Service> services = new HashSet<>();

	@OneToOne
	private User user;

	protected Provider() {
		// TODO Auto-generated constructor stub
	}
	
	public Provider(String name) {
		this.name = name;
	}
	
	public Provider(String name, String description, String address, String email, String phone, String type) {
		super();
		this.name = name;
		this.description = description;
		this.address = address;
		this.email = email;
		this.phone = phone;
		this.type = type;
	}

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

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	@Override
	public String toString() {
		return "Provider [providerId=" + providerId + ", name=" + name + ", description=" + description + ", address="
				+ address + ", email=" + email + ", phone=" + phone + ", type=" + type + "]";
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
	
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
}
