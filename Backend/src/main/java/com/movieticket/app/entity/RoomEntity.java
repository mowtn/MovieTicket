package com.movieticket.app.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "room")
@Getter @Setter
public class RoomEntity extends BaseEntity {

	private String name;
	
	@ManyToOne
	private CinemaEntity cinema;
	
	@OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Set<SeatEntity> seats = new HashSet<>();
	
	@OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Set<ShowtimeEntity> showtimes = new HashSet<>();
}
