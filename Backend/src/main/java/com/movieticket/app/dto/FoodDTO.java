package com.movieticket.app.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FoodDTO extends BaseDTO {
	private String name;
	private MultipartFile thumbnailFile;
	private String description;
	private int price;
}
