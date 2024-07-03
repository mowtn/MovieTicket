package com.movieticket.app.dto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class PageableDTO {
	private int page;
	private int size;
	private int totalPages;
	private long totalItems;
	private String property;
	private Direction direction;
	
	public static <T> PageableDTO from(Page<T> page) {
		Order order = page.getSort().toList().get(0);
		return new PageableDTO(page.getNumber() + 1, page.getSize(), page.getTotalPages(), page.getTotalElements(), order.getProperty(), order.getDirection());
	}
}
