package com.movieticket.app.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PasswordDTO {
	private String oldPass;
	private String newPass;
	private String retypePass;
}
