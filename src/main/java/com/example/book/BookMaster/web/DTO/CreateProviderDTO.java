package com.example.book.BookMaster.web.DTO;

import java.time.LocalTime;

public class CreateProviderDTO {
	public String name;
	public String description;
	public String address;
	public String email;
	public String phone;
	public String type;
	public LocalTime startTime;
	public LocalTime endTime;
	public int timeBlockMinutes;
	public String userId;
}
