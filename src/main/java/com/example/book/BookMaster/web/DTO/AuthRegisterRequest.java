package com.example.book.BookMaster.web.DTO;

import com.example.book.BookMaster.models.Provider;

public class AuthRegisterRequest {
    public String username;
    public String email;
    public String password;
    public String firstName;
    public String lastName;
    public String language;
    public Provider provider;
}
