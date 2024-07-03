package com.movieticket.app.repository.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;

import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.entity.ShowtimeEntity;
import com.movieticket.app.repository.ShowtimeRepositoryCustom;

public class ShowtimeRepositoryImpl implements ShowtimeRepositoryCustom {
	@Autowired
	EntityManager em;
	
	public List<ShowtimeEntity> findAllByFilter(QueryFilter filter) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<ShowtimeEntity> query = cb.createQuery(ShowtimeEntity.class);
		Root<ShowtimeEntity> root = query.from(ShowtimeEntity.class);
		
		List<Predicate> predicates = new ArrayList<>();
		predicates.add(cb.greaterThanOrEqualTo(root.get("startTime").as(LocalDate.class), filter.getFromDate()));
		predicates.add(cb.lessThanOrEqualTo(root.get("startTime").as(LocalDate.class), filter.getToDate()));
		
		if (filter.getCinemaId() != null) {
			predicates.add(cb.equal(root.get("room").get("cinema"), filter.getCinemaId()));
		}
		if (filter.getMovieId() != null) {
			predicates.add(cb.equal(root.get("movie"), filter.getMovieId()));
		}
		query.where(predicates.toArray(new Predicate[0]));
		
		return em.createQuery(query).getResultList();
	}
	
}
