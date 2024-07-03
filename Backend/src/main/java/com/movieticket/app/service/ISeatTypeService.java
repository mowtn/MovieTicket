package com.movieticket.app.service;

import java.util.List;

import com.movieticket.app.dto.SeatTypeDTO;
import com.movieticket.app.entity.SeatTypeEntity;

public interface ISeatTypeService {
	List<SeatTypeEntity> findAll();
	
	SeatTypeEntity findOne(Long id);
	
	SeatTypeEntity create(SeatTypeDTO typeInfo);
	
	SeatTypeEntity update(Long id, SeatTypeDTO typeInfo);
	
	int delete(Long[] ids);
}
