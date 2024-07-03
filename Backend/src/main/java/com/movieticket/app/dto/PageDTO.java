package com.movieticket.app.dto;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PageDTO<T> {
	private List<T> data = new ArrayList<>();
	private PageableDTO page = new PageableDTO();
	
	public static <T> PageDTO<T> from(Page<T> page) {
		PageDTO<T> pageDTO = new PageDTO<>();
		pageDTO.setData(page.getContent());
		pageDTO.setPage(PageableDTO.from(page));
		return pageDTO;
	}
}
