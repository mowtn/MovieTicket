package com.movieticket.app.service;

import java.util.List;

import com.movieticket.app.dto.CinemaDTO;
import com.movieticket.app.entity.CinemaEntity;

public interface ICinemaService {
	List<CinemaEntity> findAll();
	List<CinemaEntity> findByActiveTrue();
	
	CinemaEntity findOne(Long id);
	
	CinemaEntity create(CinemaDTO cinemaInfo);
	
	CinemaEntity update(Long id, CinemaDTO cinemaInfo);
	
	int delete(Long[] ids);
}
