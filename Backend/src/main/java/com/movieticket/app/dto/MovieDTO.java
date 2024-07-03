package com.movieticket.app.dto;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MovieDTO extends BaseDTO {
	private String name;
	private MultipartFile thumbnailFile;
	private String description;
	private String director;
	private String actor;
	private String genre;
	@DateTimeFormat(iso = ISO.DATE)
	private LocalDate premiere;
	private int duration;
}
