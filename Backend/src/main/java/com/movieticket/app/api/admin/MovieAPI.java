package com.movieticket.app.api.admin;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.movieticket.app.constants.RoleName;
import com.movieticket.app.dto.MovieDTO;
import com.movieticket.app.dto.PageDTO;
import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.entity.MovieEntity;
import com.movieticket.app.service.IMovieService;

@RestController(value = "adminMovie")
@RequestMapping(value = "admin/movie")
public class MovieAPI {
	@Autowired IMovieService movieService;
	
	@GetMapping
	List<MovieEntity> getAll() {
		return movieService.findAll();
	}
	
	@GetMapping("page")
	PageDTO<MovieEntity> getAll(QueryFilter filter) {
		return movieService.findAll(filter);
	}
	
	@GetMapping("{id}")
	MovieEntity getOne(@PathVariable Long id) {
		return movieService.findOne(id);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_MOVIE+"')")
	MovieEntity create(@ModelAttribute MovieDTO movieInfo) throws IllegalStateException, IOException {
		return movieService.create(movieInfo);
	}
	
	@PutMapping(value = "{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_MOVIE+"')")
	MovieEntity update(@PathVariable Long id, @ModelAttribute MovieDTO movieInfo) throws IllegalStateException, IOException {
		return movieService.update(id, movieInfo);
	}
	
	@DeleteMapping
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_MOVIE+"')")
	int delete(@RequestBody Long[] ids) {
		return movieService.delete(ids);
	}
}