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
import com.movieticket.app.dto.SeatTypeDTO;
import com.movieticket.app.entity.SeatTypeEntity;
import com.movieticket.app.service.ISeatTypeService;

@RestController
@RequestMapping(value = "admin/seattype")
public class SeatTypeAPI {
	@Autowired ISeatTypeService seatTypeService;
	
	@GetMapping
	List<SeatTypeEntity> getAll() {
		return seatTypeService.findAll();
	}
	
	@GetMapping("{id}")
	SeatTypeEntity getOne(@PathVariable Long id) {
		return seatTypeService.findOne(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_CINEMA+"')")
	SeatTypeEntity create(@RequestBody SeatTypeDTO typeInfo) {
		return seatTypeService.create(typeInfo);
	}
	
	@PutMapping("{id}")
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_CINEMA+"')")
	SeatTypeEntity update(@PathVariable Long id, @RequestBody SeatTypeDTO typeInfo) {
		return seatTypeService.update(id, typeInfo);
	}
	
	@DeleteMapping
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_CINEMA+"')")
	int delete(@RequestBody Long[] ids) {
		return seatTypeService.delete(ids);
	}
}