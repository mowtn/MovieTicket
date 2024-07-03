package com.movieticket.app.api.admin;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
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
import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.dto.ShowtimeDTO;
import com.movieticket.app.entity.ShowtimeEntity;
import com.movieticket.app.service.IShowtimeService;

@RestController
@RequestMapping(value = "admin/showtime")
public class ShowtimeAPI {
	@Autowired IShowtimeService showtimeService;
	
	@GetMapping
	List<ShowtimeEntity> getAll(Long cinemaId, @DateTimeFormat(iso = ISO.DATE) LocalDate startTime) {
		return showtimeService.findByCinemaIdAndStartTime(cinemaId, startTime);
	}
	
	@GetMapping("/filter")
	List<ShowtimeEntity> getAllByFilter(QueryFilter filter) {
		return showtimeService.findAllByFilter(filter);
	}
	
	@GetMapping("{id}")
	ShowtimeEntity getOne(@PathVariable Long id) {
		return showtimeService.findOne(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_SHOWTIME+"')")
	List<ShowtimeEntity> create(@RequestBody List<ShowtimeDTO> showtimeInfo) {
		return showtimeService.createAll(showtimeInfo);
	}
	
	@PutMapping("{id}")
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_SHOWTIME+"')")
	ShowtimeEntity update(@PathVariable Long id, @RequestBody ShowtimeDTO showtimeInfo) {
		return showtimeService.update(id, showtimeInfo);
	}
	
	@DeleteMapping
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_SHOWTIME+"')")
	int delete(@RequestBody Long[] ids) {
		return showtimeService.delete(ids);
	}
}