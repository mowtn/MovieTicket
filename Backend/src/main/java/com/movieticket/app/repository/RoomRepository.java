package com.movieticket.app.repository;

import java.util.List;

import org.springframework.data.domain.Sort;

import com.movieticket.app.entity.RoomEntity;

public interface RoomRepository extends BaseRepository<RoomEntity, Long> {
	List<RoomEntity> findByCinemaId(Long id, Sort sort);
}
