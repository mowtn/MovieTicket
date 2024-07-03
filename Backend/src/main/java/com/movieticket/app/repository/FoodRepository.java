package com.movieticket.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.movieticket.app.entity.FoodEntity;

public interface FoodRepository extends BaseRepository<FoodEntity, Long> {
	Page<FoodEntity> findBySearchValueContains(String q, Pageable pageable);
}
