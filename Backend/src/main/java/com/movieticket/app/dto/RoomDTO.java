package com.movieticket.app.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RoomDTO extends BaseDTO {
	private String name;
	private Long cinemaId;
}
