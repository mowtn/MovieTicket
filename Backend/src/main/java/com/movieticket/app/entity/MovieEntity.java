package com.movieticket.app.entity;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.movieticket.app.utils.SlugUtil;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "movie")
@Getter @Setter
public class MovieEntity extends BaseEntity {

	private String name;
	
	private String slug;
	
	private String thumbnail;

	@Column(columnDefinition = "TEXT")
	private String description;
	
	private String director;
	
	private String actor;
	
	private String genre;
	
	private LocalDate premiere;
	
	private int duration;

	@OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private Set<ShowtimeEntity> showtimes = new HashSet<>();
	
	@Formula("concat(name,description,director,actor,genre,premiere,duration)")
	private String searchValue;
	
	@Formula("(select count(s.id) from showtime s where s.movie_id = id and s.start_time > current_date)")
	private long showtimeCount;
	
	@PrePersist
	@PreUpdate
	public void generateSlug() {
		setSlug(SlugUtil.generate(getName()));
	}
}
