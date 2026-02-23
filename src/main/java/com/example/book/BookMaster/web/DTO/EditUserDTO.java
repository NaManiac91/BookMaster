package com.example.book.BookMaster.web.DTO;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

import com.example.book.BookMaster.models.Address;
import com.example.book.BookMaster.models.ProviderType;

public class EditUserDTO {
	public String userId;
	public String username;
	public String email;
	public String lastName;
	public String firstName;
	public String language;
	public ProviderPayload provider;

	public static class ProviderPayload {
		public String providerId;
		public String name;
		public String description;
		public Address address;
		public String email;
		public String phone;
		public ProviderType type;
		public LocalTime startTime;
		public LocalTime endTime;
		public Integer timeBlockMinutes;
		public Set<DayOfWeek> closedDays;
		public Set<LocalDate> closedDates;
	}
}
