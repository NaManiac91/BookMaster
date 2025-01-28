package com.example.book.BookMaster;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.book.BookMaster.models.User;
import com.example.book.BookMaster.services.AdminService;
import com.example.book.BookMaster.services.FetchService;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootApplication
public class BookMasterApplication implements CommandLineRunner {
	@Autowired
	private AdminService adminService;
	
	@Autowired
	private FetchService fetchService;
	
	public static void main(String[] args) {
		SpringApplication.run(BookMasterApplication.class, args);
	}
	
	@Override
	public void run(String... args) throws Exception  {
		//this.initProviders();
		//this.initServices();

		//this.initUsers();
	}
	
	private void initProviders() {
		this.adminService.createProvider("DNails");
		this.adminService.createProvider("Vick");
		this.adminService.createProvider("Trinity College");
		
		this.fetchService.getProviders().forEach(p -> System.out.println(p));
	}

	private void initUsers() {
		User ciccio = this.adminService.createUser("CIccio", "ciccio@mail.com");
		this.adminService.createUser("Franco", "franco@mail.com");
		this.adminService.createUser("Bobby", "bobby@mail.com");
		
		this.fetchService.getUsers().forEach(u -> System.out.println(u));
		
		this.adminService.randomReservation(ciccio);
	}

	private void initServices() {
		this.adminService.createService("colata");
		this.adminService.createService("taglio");
		this.adminService.createService("corso di inglese");
		
		this.fetchService.getServices().forEach(s -> System.out.println(s));
	}

	/*
	static class TourFromFile {
		private String packageType, title, description, price, difficulty;
		
		static List<TourFromFile> importData(String path) throws IOException {
			return new ObjectMapper().setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY)
					.readValue(TourFromFile.class.getResourceAsStream(path), new TypeReference<List<TourFromFile>>() {});
		}
	}*/
	
}
