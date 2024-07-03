package com.movieticket.app.service.impl;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movieticket.app.dto.RoomDTO;
import com.movieticket.app.entity.RoomEntity;
import com.movieticket.app.repository.CinemaRepository;
import com.movieticket.app.repository.RoomRepository;
import com.movieticket.app.service.IRoomService;

@Service
@Transactional
public class RoomService implements IRoomService{
	@Autowired CinemaRepository cinemaRepository;
	@Autowired RoomRepository roomRepository;
	
	public List<RoomEntity> findAll(){
		return roomRepository.findAll(Sort.by(Direction.ASC, "id"));
	}
	
	public List<RoomEntity> findAll(Long cinemaId){
		return roomRepository.findByCinemaId(cinemaId, Sort.by(Direction.ASC, "id"));
	}
	
	public RoomEntity findOne(Long id) {
		return roomRepository.findById(id).orElseThrow(()-> new NoSuchElementException("Không tìm thấy phòng"));
	}
	
	public RoomEntity create(RoomDTO roomInfo) {
		RoomEntity room = new RoomEntity();
		BeanUtils.copyProperties(roomInfo, room);
		room.setCinema(cinemaRepository.findById(roomInfo.getCinemaId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy cinema")));
		return roomRepository.save(room);
	}
	
	public RoomEntity update(Long id, RoomDTO roomInfo) {
		RoomEntity room = findOne(id);
		BeanUtils.copyProperties(roomInfo, room);
		room.setCinema(cinemaRepository.findById(roomInfo.getCinemaId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy cinema")));
		return room;
	}
	
	public int delete(Long[] ids) {
		return roomRepository.deleteByIdIn(ids);
	}
}
