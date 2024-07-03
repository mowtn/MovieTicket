package com.movieticket.app.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SeatDTO extends BaseDTO {
	private String name;
	private int rowOrder;
	private int columnOrder;
	private Long roomId;
	private Long typeId;
}
