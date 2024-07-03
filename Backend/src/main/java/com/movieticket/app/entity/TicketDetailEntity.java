package com.movieticket.app.entity;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ticketdetail")
@Getter @Setter
public class TicketDetailEntity extends BaseEntity {
	
	@ManyToOne
	@JsonIgnore
	private TicketEntity ticket;
	
	@ManyToOne
	private SeatEntity seat;
	
	@ManyToOne
	private FoodEntity food;
	
	private int quantity;
	
	private int price;
}
