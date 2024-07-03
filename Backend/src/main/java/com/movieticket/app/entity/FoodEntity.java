package com.movieticket.app.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "food")
@Getter @Setter
public class FoodEntity extends BaseEntity {

	private String name;

	private String thumbnail;
	
	@Column(columnDefinition = "TEXT")
	private String description;
	
	private int price;

	@OneToMany(mappedBy = "food", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Set<TicketDetailEntity> ticketDetails = new HashSet<>();
	
	@Formula("concat(name,description,price)")
	private String searchValue;
}
