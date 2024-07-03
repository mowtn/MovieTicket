package com.movieticket.app.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.movieticket.app.entity.MovieEntity;

public interface MovieRepository extends BaseRepository<MovieEntity, Long>, MovieRepositotyCustom, JpaSpecificationExecutor<MovieEntity> {
	Page<MovieEntity> findBySearchValueContains(String q, Pageable pageable);
	
	Optional<MovieEntity> findBySlug(String slug);
}
