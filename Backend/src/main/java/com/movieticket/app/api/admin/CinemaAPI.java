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
import com.movieticket.app.dto.CinemaDTO;
import com.movieticket.app.entity.CinemaEntity;
import com.movieticket.app.service.ICinemaService;

@RestController(value = "adminCinema")
@RequestMapping(value = "admin/cinema")
public class CinemaAPI {
	@Autowired ICinemaService cinemaService;
	
	@GetMapping
	List<CinemaEntity> getAll() {
		return cinemaService.findAll();
	}
	
	@GetMapping("{id}")
	CinemaEntity getOne(@PathVariable Long id) {
		return cinemaService.findOne(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_CINEMA+"')")
	CinemaEntity create(@RequestBody CinemaDTO cinemaInfo) {
		return cinemaService.create(cinemaInfo);
	}
	
	@PutMapping("{id}")
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_CINEMA+"')")
	CinemaEntity update(@PathVariable Long id, @RequestBody CinemaDTO cinemaInfo) {
		return cinemaService.update(id, cinemaInfo);
	}
	
	@DeleteMapping
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_CINEMA+"')")
	int delete(@RequestBody Long[] ids) {
		return cinemaService.delete(ids);
	}
}