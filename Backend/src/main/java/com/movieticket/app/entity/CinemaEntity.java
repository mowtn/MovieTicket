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
@Table(name = "cinema")
@Getter @Setter
public class CinemaEntity extends BaseEntity {
	
	private String name;
	
	private String address;
	
	@OneToMany(mappedBy = "cinema", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Set<RoomEntity> rooms = new HashSet<>();
}
