package com.example.book.BookMaster.web.DTO;

import java.time.LocalTime;

import com.example.book.BookMaster.models.Address;
import com.example.book.BookMaster.models.ProviderType;

public class CreateProviderDTO {
	public String name;
	public String description;
	public Address address;
	public String email;
	public String phone;
	public ProviderType type;
	public LocalTime startTime;
	public LocalTime endTime;
	public int timeBlockMinutes;
	public String userId;
}
