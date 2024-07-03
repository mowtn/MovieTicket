package com.movieticket.app.dto;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ShowtimeDTO extends BaseDTO {
	@DateTimeFormat(iso = ISO.DATE_TIME)
	private LocalDateTime startTime;
	private Long movieId;
	private Long roomId;
}
