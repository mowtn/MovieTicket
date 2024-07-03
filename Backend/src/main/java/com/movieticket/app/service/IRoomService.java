package com.movieticket.app.service;

import java.util.List;

import com.movieticket.app.dto.RoomDTO;
import com.movieticket.app.entity.RoomEntity;

public interface IRoomService {
	List<RoomEntity> findAll();

	List<RoomEntity> findAll(Long cinemaId);
	
	RoomEntity findOne(Long id);
	
	RoomEntity create(RoomDTO roomInfo);
	
	RoomEntity update(Long id, RoomDTO roomInfo);
	
	int delete(Long[] ids);
}
