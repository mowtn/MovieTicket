package com.movieticket.app.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TicketDTO extends BaseDTO {
	private Long userId;
	private Long showtimeId;
	private String note;
	private List<TicketDetailDTO> details = new ArrayList<>();
}
