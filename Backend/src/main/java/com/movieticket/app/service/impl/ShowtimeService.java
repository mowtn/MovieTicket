package com.movieticket.app.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.dto.ShowtimeDTO;
import com.movieticket.app.entity.ShowtimeEntity;
import com.movieticket.app.repository.MovieRepository;
import com.movieticket.app.repository.RoomRepository;
import com.movieticket.app.repository.ShowtimeRepository;
import com.movieticket.app.service.IShowtimeService;

@Service
@Transactional
public class ShowtimeService implements IShowtimeService {
	@Autowired ShowtimeRepository showtimeRepository;
	@Autowired RoomRepository roomRepository;
	@Autowired MovieRepository movieRepository;
	
	public List<ShowtimeEntity> findAll(){
		return showtimeRepository.findAll(Sort.by(Direction.DESC, "startTime"));
	}
	
	public List<ShowtimeEntity> findAllByFilter(QueryFilter filter) {
		return showtimeRepository.findAllByFilter(filter);
	}
	
	public List<ShowtimeEntity> findByMovieIdAndStartTime(Long movieId, LocalDate startTime){
		return showtimeRepository.findByMovieIdAndStartTime(movieId, startTime, Sort.by(Direction.ASC, "startTime"));
	}
	
	public List<ShowtimeEntity> findByCinemaIdAndStartTime(Long cinemaId, LocalDate startTime){
		return showtimeRepository.findByCinemaIdAndStartTime(cinemaId, startTime, Sort.by(Direction.ASC, "startTime"));
	}
	
	public List<ShowtimeEntity> findByMovieIdAndStartTimeAndActiveTrue(Long movieId, LocalDate startTime){

		List<ShowtimeEntity> list =showtimeRepository.findByMovieIdAndStartTimeAndActiveTrue(movieId, startTime, Sort.by(Direction.ASC, "startTime"));
		return list;
	}
	
	public List<ShowtimeEntity> findByCinemaIdAndStartTimeAndActiveTrue(Long cinemaId, LocalDate startTime){

		return showtimeRepository.findByCinemaIdAndStartTimeAndActiveTrue(cinemaId, startTime, Sort.by(Direction.ASC, "startTime"));
	}
	
	public ShowtimeEntity findOne(Long id) {
		return showtimeRepository.findById(id).orElseThrow(()-> new NoSuchElementException("Không tìm thấy lịch chiếu"));
	}
	
	public ShowtimeEntity create(ShowtimeDTO showtimeInfo) {
		ShowtimeEntity showtime = new ShowtimeEntity();
		BeanUtils.copyProperties(showtimeInfo, showtime);
		showtime.setRoom(roomRepository.findById(showtimeInfo.getRoomId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy phòng")));
		showtime.setMovie(movieRepository.findById(showtimeInfo.getMovieId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy phim")));
		return showtimeRepository.save(showtime);
	}

	public List<ShowtimeEntity> createAll(List<ShowtimeDTO> showtimeInfos) {
		List<ShowtimeEntity> showtimes = showtimeInfos.stream().map(showtimeInfo -> {
			ShowtimeEntity showtime = new ShowtimeEntity();
			BeanUtils.copyProperties(showtimeInfo, showtime);
			showtime.setRoom(roomRepository.findById(showtimeInfo.getRoomId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy phòng")));
			showtime.setMovie(movieRepository.findById(showtimeInfo.getMovieId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy phim")));
			return showtime;
		}).collect(Collectors.toList());
		return showtimeRepository.saveAll(showtimes);
	}
	
	public ShowtimeEntity update(Long id, ShowtimeDTO showtimeInfo) {
		ShowtimeEntity showtime = findOne(id);
		BeanUtils.copyProperties(showtimeInfo, showtime);
		showtime.setRoom(roomRepository.findById(showtimeInfo.getRoomId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy phòng")));
		showtime.setMovie(movieRepository.findById(showtimeInfo.getMovieId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy phim")));
		return showtime;
	}
	
	public int delete(Long[] ids) {
		return showtimeRepository.deleteByIdIn(ids);
	}
}
