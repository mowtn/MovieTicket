package com.movieticket.app.api.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.movieticket.app.constants.RoleName;
import com.movieticket.app.dto.PageDTO;
import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.dto.ReportOutputDTO;
import com.movieticket.app.dto.TicketDTO;
import com.movieticket.app.entity.TicketEntity;
import com.movieticket.app.service.ITicketService;

@RestController("adminTicket")
@RequestMapping(value = "admin/ticket")
public class TicketAPI {
	@Autowired ITicketService ticketService;
	
	@GetMapping
	List<TicketEntity> getAll(QueryFilter filter) {
		return ticketService.findAllByFilter(filter);
	}
	
	@GetMapping("/page")
	PageDTO<TicketEntity> getAllWithPage(QueryFilter filter) {
		return ticketService.findByFilter(filter);
	}
	
	@GetMapping("/report")
	ReportOutputDTO getReport(QueryFilter filter) {
		return ticketService.getReport(filter);
	}
	
	@GetMapping("{id}")
	TicketEntity getOne(@PathVariable Long id) {
		return ticketService.findOne(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_TICKET+"')")
	TicketEntity create(@RequestBody TicketDTO ticketInfo) {
		return ticketService.create(ticketInfo);
	}
	
	@PutMapping("{id}")
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_TICKET+"')")
	TicketEntity update(@PathVariable Long id, @RequestBody TicketDTO ticketDTO) {
		return ticketService.update(id, ticketDTO);
	}
	
	@DeleteMapping
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_TICKET+"')")
	int delete(@RequestBody Long[] ids) {
		return ticketService.delete(ids);
	}
}