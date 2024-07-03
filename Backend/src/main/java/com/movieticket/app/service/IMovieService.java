package com.movieticket.app.service;

import java.io.IOException;
import java.util.List;

import com.movieticket.app.dto.MovieDTO;
import com.movieticket.app.dto.PageDTO;
import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.entity.MovieEntity;

public interface IMovieService {
	List<MovieEntity> findAll();
	PageDTO<MovieEntity> findAll(QueryFilter filter);
	PageDTO<MovieEntity> findByMovieTypeAndActiveTrue(QueryFilter filter, String type);
	
	MovieEntity findOne(Long id);
	
	MovieEntity findBySlug(String slug);
	
	MovieEntity create(MovieDTO movieInfo) throws IllegalStateException, IOException;
	
	MovieEntity update(Long id, MovieDTO movieInfo) throws IllegalStateException, IOException;
	
	int delete(Long[] ids);
}
