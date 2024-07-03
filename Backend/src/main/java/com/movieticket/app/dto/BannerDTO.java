package com.movieticket.app.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BannerDTO extends BaseDTO {
	private MultipartFile thumbnailFile;
	private String link;
}
