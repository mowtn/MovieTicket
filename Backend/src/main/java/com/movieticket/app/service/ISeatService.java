package com.movieticket.app.service;

import java.util.List;

import com.movieticket.app.dto.SeatDTO;
import com.movieticket.app.entity.SeatEntity;

public interface ISeatService {
	List<SeatEntity> findAll();

	List<SeatEntity> findAll(Long roomId);

	List<SeatEntity> findByRoomIdAndActiveTrueWithOccupied(Long roomId, Long showtimeId);
	
	SeatEntity findOne(Long id);
	
	SeatEntity create(SeatDTO seatInfo);
	
	SeatEntity update(Long id, SeatDTO seatInfo);
	
	int delete(Long[] ids);
}
