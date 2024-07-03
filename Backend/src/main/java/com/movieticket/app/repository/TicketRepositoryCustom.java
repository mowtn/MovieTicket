package com.movieticket.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;

import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.dto.ReportOutputDTO;
import com.movieticket.app.entity.TicketEntity;

public interface TicketRepositoryCustom {
	Page<TicketEntity> findByFilter(QueryFilter filter);
	List<TicketEntity> findAllByFilter(QueryFilter filter);
	ReportOutputDTO getReport(QueryFilter filter);
}
