package com.movieticket.app.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TicketDetailDTO extends BaseDTO {
	private Long seatId;
	private Long foodId;
	private int quantity;
}
