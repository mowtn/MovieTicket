package com.movieticket.app.repository.impl;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.movieticket.app.entity.MovieEntity;
import com.movieticket.app.entity.ShowtimeEntity;
import com.movieticket.app.entity.TicketEntity;
import com.movieticket.app.repository.MovieRepositotyCustom;

public class MovieRepositoryImpl implements MovieRepositotyCustom {
	@Autowired EntityManager em;
	
	public Page<MovieEntity> findBySearchValueContainsAndMovieTypeAndActiveTrue(String q, String movieType, Pageable pageable) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<MovieEntity> query = cb.createQuery(MovieEntity.class);
		Root<MovieEntity> root = query.from(MovieEntity.class);
		
		List<Predicate> predicates = new ArrayList<>();
		predicates.add(cb.like(root.get("searchValue"), "%"+q+"%"));
		predicates.add(cb.equal(root.get("active"), true));
		switch(movieType) {
			case "current":
				query.orderBy(cb.desc(root.get("premiere")));
				predicates.add(cb.lessThanOrEqualTo(root.get("premiere"), cb.currentDate()));
				break;
			case "coming-soon":
				query.orderBy(cb.asc(root.get("premiere")));
				predicates.add(cb.greaterThan(root.get("premiere"), cb.currentDate()));
				break;
			case "popular":
				Join<ShowtimeEntity, TicketEntity> ticketRoot = root.join("showtimes",JoinType.LEFT).join("tickets",JoinType.LEFT);
				ticketRoot.on(cb.equal(ticketRoot.get("active"), true));
				query.groupBy(root)
					 .orderBy(cb.desc(cb.selectCase()
							 			.when(cb.greaterThan(root.get("showtimeCount"), 0), 1)
							 			.otherwise(0)), //order by has showtime or not
							  cb.desc(cb.count(ticketRoot)));
				break;
		}
		query.where(predicates.toArray(new Predicate[0]));
		List<MovieEntity> content = em.createQuery(query)
									  .setFirstResult((int)pageable.getOffset())
									  .setMaxResults(pageable.getPageSize())
									  .getResultList();
		
		CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
		countQuery.select(cb.count(countQuery.from(MovieEntity.class))).where(predicates.toArray(new Predicate[0]));
		long total = em.createQuery(countQuery).getSingleResult();
		
		return new PageImpl<>(content, pageable, total);
	}

}
