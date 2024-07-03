package com.movieticket.app.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportOutputDTO {
	private Long ticketCount;
	
	private Long revenue;
	
	private Long bookedSeat;
	
	private Long totalSeat;
}
