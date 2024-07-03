package com.movieticket.app.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.movieticket.app.constants.TicketStatus;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "showtime")
@Getter @Setter
public class ShowtimeEntity extends BaseEntity {
	
	private LocalDateTime startTime;
	
	@ManyToOne
	private MovieEntity movie;
	
	@ManyToOne
	private RoomEntity room;

	@OneToMany(mappedBy = "showtime", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Set<TicketEntity> tickets = new HashSet<>();

	@Formula("(select count(s.id) from seat s where s.room_id = room_id and s.active = true)")
	private int totalSeatCount;

	@Formula("(select count(s.id) from seat s "
			+ "join ticketdetail d on d.seat_id = s.id "
			+ "join ticket t on d.ticket_id = t.id "
			+ "where t.status = "+TicketStatus.PAYMENT_SUCCESS+" and t.showtime_id = id)")
	private int occupiedSeatCount;
}
