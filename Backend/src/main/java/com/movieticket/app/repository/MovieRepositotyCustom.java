package com.movieticket.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.movieticket.app.entity.MovieEntity;

public interface MovieRepositotyCustom {
	Page<MovieEntity> findBySearchValueContainsAndMovieTypeAndActiveTrue(String q, String movieType, Pageable pageable);
}
