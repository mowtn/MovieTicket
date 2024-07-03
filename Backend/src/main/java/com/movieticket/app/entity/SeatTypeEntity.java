package com.movieticket.app.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "seattype")
@Getter @Setter
public class SeatTypeEntity extends BaseEntity {
	
	private String name;
	
	private String color;
	
	private int price;
	
	@OneToMany(mappedBy = "type", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Set<SeatEntity> seats = new HashSet<>();
}
