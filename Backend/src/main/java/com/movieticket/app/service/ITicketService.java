package com.movieticket.app.service;

import java.util.List;

import com.movieticket.app.dto.PageDTO;
import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.dto.ReportOutputDTO;
import com.movieticket.app.dto.TicketDTO;
import com.movieticket.app.entity.TicketEntity;

public interface ITicketService {
	List<TicketEntity> findAllByFilter(QueryFilter filter);
	PageDTO<TicketEntity> findByFilter(QueryFilter filter);
	ReportOutputDTO getReport(QueryFilter filter);
	List<TicketEntity> findByUserId(Long userId);
	
	TicketEntity findOne(Long id);
	TicketEntity create(TicketDTO ticketDTO);
	
	TicketEntity update(Long id, TicketDTO ticketDTO);
	
	int updateStatus(Long id, int status);
	
	int delete(Long[] ids);
}
