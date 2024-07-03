package com.movieticket.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;

import com.movieticket.app.constants.TicketStatus;
import com.movieticket.app.entity.SeatEntity;

public interface SeatRepository extends BaseRepository<SeatEntity, Long> {
	List<SeatEntity> findByRoomId(Long roomId);
	List<SeatEntity> findByRoomIdAndActiveTrue(Long roomId);
	Optional<SeatEntity> findByRoomIdAndRowOrderAndColumnOrder(Long roomId, int rowOrder, int columnOrder);
	
	@Query("select e from #{#entityName} e join e.ticketDetails d where d.ticket.status = "+TicketStatus.PAYMENT_SUCCESS+" and d.ticket.showtime.id = :showtimeId")
	List<SeatEntity> findOccupiedByShowtimeId(Long showtimeId);
}