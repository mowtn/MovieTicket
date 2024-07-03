package com.movieticket.app.entity;

import java.time.LocalDateTime;

import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.SequenceGenerator;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter
//@JsonIdentityInfo(generator=ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class BaseEntity {
	@Id
	@SequenceGenerator(name = "seq_generator_id", sequenceName = "seq_generator_id", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_generator_id")
	@Setter(AccessLevel.NONE)
	private Long id;
	
	@CreatedDate
	private LocalDateTime createdDate;
	
	@CreatedBy
	private String createdBy;
	
	@LastModifiedDate
	private LocalDateTime modifiedDate;
	
	@LastModifiedBy
	private String modifiedBy;
	
	private boolean active = true;
}
