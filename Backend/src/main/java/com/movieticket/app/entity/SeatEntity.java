package com.movieticket.app.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "seat")
@Getter @Setter
public class SeatEntity extends BaseEntity {
	
	private String name;
	
	private int rowOrder;
	
	private int columnOrder;
	
	@ManyToOne
	private RoomEntity room;
	
	@ManyToOne
	private SeatTypeEntity type;

	@OneToMany(mappedBy = "seat", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Set<TicketDetailEntity> ticketDetails = new HashSet<>();
	
	@Transient
	private boolean isOccupied;
}
