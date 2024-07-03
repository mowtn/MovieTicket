package com.movieticket.app.service.impl;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movieticket.app.dto.SeatTypeDTO;
import com.movieticket.app.entity.SeatTypeEntity;
import com.movieticket.app.repository.SeatTypeRepository;
import com.movieticket.app.service.ISeatTypeService;

@Service
@Transactional
public class SeatTypeService implements ISeatTypeService {
	@Autowired SeatTypeRepository seatTypeRepository;
	
	public List<SeatTypeEntity> findAll(){
		return seatTypeRepository.findAll(Sort.by(Direction.ASC, "id"));
	}
	
	public SeatTypeEntity findOne(Long id) {
		return seatTypeRepository.findById(id).orElseThrow(()-> new NoSuchElementException("Không tìm thấy loại ghế"));
	}
	
	public SeatTypeEntity create(SeatTypeDTO typeInfo) {
		SeatTypeEntity type = new SeatTypeEntity();
		BeanUtils.copyProperties(typeInfo, type);
		return seatTypeRepository.save(type);
	}
	
	public SeatTypeEntity update(Long id, SeatTypeDTO typeInfo) {
		SeatTypeEntity type = findOne(id);
		BeanUtils.copyProperties(typeInfo, type);
		return type;
	}
	
	public int delete(Long[] ids) {
		return seatTypeRepository.deleteByIdIn(ids);
	}
}
