package com.movieticket.app.dto;

import java.time.LocalDate;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class QueryFilter {
	private String q = "";
	private int page = 1;
	private int size = 10;
	private String property = "id";
	private Direction direction = Direction.DESC;
	
	@DateTimeFormat(iso = ISO.DATE)
	private LocalDate fromDate;
	@DateTimeFormat(iso = ISO.DATE)
	private LocalDate toDate;
	private Integer cinemaId;
	private Integer movieId;
	
	public void setDirection(String direction) {
		if (direction != null) this.direction = Direction.fromOptionalString(direction).orElse(Direction.ASC);
	}
	
	public Pageable toPageable() {
		return PageRequest.of(page-1, size, direction, property);
	}
}
