package com.movieticket.app.api.web;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movieticket.app.entity.CinemaEntity;
import com.movieticket.app.entity.ShowtimeEntity;
import com.movieticket.app.service.ICinemaService;
import com.movieticket.app.service.IShowtimeService;

@RestController
@RequestMapping(value = "cinema")
public class CinemaAPI {
	@Autowired ICinemaService cinemaService;
	@Autowired IShowtimeService showtimeService;
	
	@GetMapping
	List<CinemaEntity> getAll() {
		return cinemaService.findByActiveTrue();
	}
	
	@GetMapping("{cinemaId}/showtime")
	List<ShowtimeEntity> findByCinemaIdAndStartTime(@PathVariable Long cinemaId, @DateTimeFormat(iso = ISO.DATE) LocalDate startTime){
		return showtimeService.findByCinemaIdAndStartTimeAndActiveTrue(cinemaId, startTime);
	}
}
