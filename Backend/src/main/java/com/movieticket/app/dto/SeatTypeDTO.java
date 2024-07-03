package com.movieticket.app.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SeatTypeDTO extends BaseDTO {
	private String name;
	private String color;
	private int price;
}
