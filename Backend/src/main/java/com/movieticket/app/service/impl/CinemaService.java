package com.movieticket.app.service.impl;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movieticket.app.dto.CinemaDTO;
import com.movieticket.app.entity.CinemaEntity;
import com.movieticket.app.repository.CinemaRepository;
import com.movieticket.app.service.ICinemaService;

@Service
@Transactional
public class CinemaService implements ICinemaService {
	@Autowired CinemaRepository cinemaRepository;
	
	public List<CinemaEntity> findAll(){
		return cinemaRepository.findAll(Sort.by(Direction.ASC, "id"));
	}
	
	public List<CinemaEntity> findByActiveTrue(){
		return cinemaRepository.findByActive(true, Sort.by(Direction.ASC, "id"));
	}
	
	public CinemaEntity findOne(Long id) {
		return cinemaRepository.findById(id).orElseThrow(()-> new NoSuchElementException("Không tìm thấy cinema"));
	}
	
	public CinemaEntity create(CinemaDTO cinemaInfo) {
		CinemaEntity cinema = new CinemaEntity();
		BeanUtils.copyProperties(cinemaInfo, cinema);
		return cinemaRepository.save(cinema);
	}
	
	public CinemaEntity update(Long id, CinemaDTO cinemaInfo) {
		CinemaEntity cinema = findOne(id);
		BeanUtils.copyProperties(cinemaInfo, cinema);
		return cinema;
	}
	
	public int delete(Long[] ids) {
		return cinemaRepository.deleteByIdIn(ids);
	}
}
