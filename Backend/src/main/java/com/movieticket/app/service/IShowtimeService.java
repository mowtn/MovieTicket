package com.movieticket.app.service;

import java.time.LocalDate;
import java.util.List;

import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.dto.ShowtimeDTO;
import com.movieticket.app.entity.ShowtimeEntity;

public interface IShowtimeService {
	List<ShowtimeEntity> findAll();
	List<ShowtimeEntity> findAllByFilter(QueryFilter filter);
	
	List<ShowtimeEntity> findByMovieIdAndStartTime(Long movieId, LocalDate startTime);
	List<ShowtimeEntity> findByCinemaIdAndStartTime(Long cinemaId, LocalDate startTime);
	List<ShowtimeEntity> findByMovieIdAndStartTimeAndActiveTrue(Long movieId, LocalDate startTime);
	List<ShowtimeEntity> findByCinemaIdAndStartTimeAndActiveTrue(Long cinemaId, LocalDate startTime);
	
	ShowtimeEntity findOne(Long id);
	
	ShowtimeEntity create(ShowtimeDTO showtimeInfo);

	List<ShowtimeEntity> createAll(List<ShowtimeDTO> showtimeInfo);
	
	ShowtimeEntity update(Long id, ShowtimeDTO showtimeInfo);
	
	int delete(Long[] ids);
}
