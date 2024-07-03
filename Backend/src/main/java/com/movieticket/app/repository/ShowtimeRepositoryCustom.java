package com.movieticket.app.repository;

import java.util.List;

import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.entity.ShowtimeEntity;

public interface ShowtimeRepositoryCustom {
	List<ShowtimeEntity> findAllByFilter(QueryFilter filter);
}
