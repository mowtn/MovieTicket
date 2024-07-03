package com.movieticket.app.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Formula;

import com.movieticket.app.constants.TicketStatus;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ticket")
@Getter @Setter
public class TicketEntity extends BaseEntity {
	
	@ManyToOne
	private UserEntity user;

	@ManyToOne
	private ShowtimeEntity showtime;
	
	@Column(columnDefinition = "TEXT")
	private String note;

	private int status = TicketStatus.UNPAID;
	
	@OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<TicketDetailEntity> details = new HashSet<>();
	
	@Formula("(select sum(d.quantity * d.price) from ticketdetail d where d.ticket_id = id)")
	private long totalPrice;
}
