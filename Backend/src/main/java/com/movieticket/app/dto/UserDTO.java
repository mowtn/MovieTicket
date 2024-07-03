package com.movieticket.app.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserDTO extends BaseDTO {
	private String username;
	private String fullname;
	private String email;
	private String password;
	private String phoneNumber;
	private List<String> roleNames = new ArrayList<>();
}
