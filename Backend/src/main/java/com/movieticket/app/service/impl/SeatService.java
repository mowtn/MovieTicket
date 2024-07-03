package com.movieticket.app.service.impl;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movieticket.app.dto.SeatDTO;
import com.movieticket.app.entity.SeatEntity;
import com.movieticket.app.repository.RoomRepository;
import com.movieticket.app.repository.SeatRepository;
import com.movieticket.app.repository.SeatTypeRepository;
import com.movieticket.app.service.ISeatService;

@Service
@Transactional
public class SeatService implements ISeatService {
	@Autowired RoomRepository roomRepository;
	@Autowired SeatRepository seatRepository;
	@Autowired SeatTypeRepository seatTypeRepository;
	
	public List<SeatEntity> findAll(){
		return seatRepository.findAll();
	}
	
	public List<SeatEntity> findAll(Long roomId){
		return seatRepository.findByRoomId(roomId);
	}
	
	public List<SeatEntity> findByRoomIdAndActiveTrueWithOccupied(Long roomId, Long showtimeId){
		List<SeatEntity> seats = seatRepository.findByRoomIdAndActiveTrue(roomId);
		List<SeatEntity> occupiedSeats = seatRepository.findOccupiedByShowtimeId(showtimeId);
		seats.forEach(seat -> {
			boolean isOccupied = occupiedSeats.stream().anyMatch(s -> s.getId() == seat.getId());
			seat.setOccupied(isOccupied);
		});
		return seats;
	}
	
	public SeatEntity findOne(Long id) {
		return seatRepository.findById(id).orElseThrow(()-> new NoSuchElementException("Không tìm thấy ghế"));
	}
	
	public SeatEntity create(SeatDTO seatInfo) {
		if (seatRepository.findByRoomIdAndRowOrderAndColumnOrder(seatInfo.getRoomId(), seatInfo.getRowOrder(), seatInfo.getColumnOrder()).isPresent())
			throw new IllegalArgumentException("Đã có ghế tại vị trí này");
		SeatEntity seat = new SeatEntity();
		BeanUtils.copyProperties(seatInfo, seat);
		seat.setRoom(roomRepository.findById(seatInfo.getRoomId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy phòng")));
		seat.setType(seatTypeRepository.findById(seatInfo.getTypeId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy loại ghế")));
		return seatRepository.save(seat);
	}
	
	public SeatEntity update(Long id, SeatDTO seatInfo) {
		SeatEntity seat = findOne(id);
		SeatEntity existSeat = seatRepository.findByRoomIdAndRowOrderAndColumnOrder(seatInfo.getRoomId(), seatInfo.getRowOrder(), seatInfo.getColumnOrder()).orElse(null);
		if (existSeat != null && existSeat.getId() != seat.getId()) throw new IllegalArgumentException("Đã có ghế tại vị trí này");
		BeanUtils.copyProperties(seatInfo, seat);
		seat.setRoom(roomRepository.findById(seatInfo.getRoomId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy phòng")));
		seat.setType(seatTypeRepository.findById(seatInfo.getTypeId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy loại ghế")));
		return seat;
	}
	
	public int delete(Long[] ids) {
		return seatRepository.deleteByIdIn(ids);
	}
}
