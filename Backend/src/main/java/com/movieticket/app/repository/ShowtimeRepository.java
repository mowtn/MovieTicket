package com.movieticket.app.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;

import com.movieticket.app.entity.ShowtimeEntity;

public interface ShowtimeRepository extends BaseRepository<ShowtimeEntity, Long>, ShowtimeRepositoryCustom {
	@Query("select e from #{#entityName} e where e.movie.id = :movieId and cast(e.startTime as LocalDate) = :startTime")
	List<ShowtimeEntity> findByMovieIdAndStartTime(Long movieId, LocalDate startTime, Sort sort);

	@Query("select e from #{#entityName} e where e.room.cinema.id = :cinemaId and cast(e.startTime as LocalDate) = :startTime")
	List<ShowtimeEntity> findByCinemaIdAndStartTime(Long cinemaId, LocalDate startTime, Sort sort);

	@Query("select e from #{#entityName} e where e.movie.id = :movieId and cast(e.startTime as LocalDate) = :startTime and e.active = true")
	List<ShowtimeEntity> findByMovieIdAndStartTimeAndActiveTrue(Long movieId, LocalDate startTime, Sort sort);

	@Query("select e from #{#entityName} e where e.room.cinema.id = :cinemaId and cast(e.startTime as LocalDate) = :startTime and e.active = true")
	List<ShowtimeEntity> findByCinemaIdAndStartTimeAndActiveTrue(Long cinemaId, LocalDate startTime, Sort sort);
}
