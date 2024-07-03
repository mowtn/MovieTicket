package com.movieticket.app.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "banner")
@Getter @Setter
public class BannerEntity extends BaseEntity {

	private String thumbnail;
	
	private String link;
}
