package com.movieticket.app.repository.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Tuple;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.query.QueryUtils;

import com.movieticket.app.constants.TicketStatus;
import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.dto.ReportOutputDTO;
import com.movieticket.app.entity.ShowtimeEntity;
import com.movieticket.app.entity.TicketDetailEntity;
import com.movieticket.app.entity.TicketEntity;
import com.movieticket.app.repository.TicketRepositoryCustom;
import com.movieticket.app.utils.CriteriaBuilderUtil;

public class TicketRepositoryImpl implements TicketRepositoryCustom {
	@Autowired
	EntityManager em;

	public Page<TicketEntity> findByFilter(QueryFilter filter) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<TicketEntity> query = cb.createQuery(TicketEntity.class);
		Root<TicketEntity> root = query.from(TicketEntity.class);
		query.where(getPredicatesByFilter(cb, root, filter).toArray(new Predicate[0]));
		
		Pageable pageable = filter.toPageable();
		query.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cb));
		List<TicketEntity> content = em.createQuery(query)
									   .setFirstResult((int)pageable.getOffset())
									   .setMaxResults(pageable.getPageSize())
									   .getResultList();
		
		CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
		Root<TicketEntity> countRoot = countQuery.from(TicketEntity.class);
		countQuery.select(cb.count(countRoot))
				  .where(getPredicatesByFilter(cb, countRoot, filter).toArray(new Predicate[0]));
		long total = em.createQuery(countQuery).getSingleResult();
		
		return new PageImpl<>(content, pageable, total);
	}

	public List<TicketEntity> findAllByFilter(QueryFilter filter) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<TicketEntity> query = cb.createQuery(TicketEntity.class);
		Root<TicketEntity> root = query.from(TicketEntity.class);
		
		List<Predicate> predicates = new ArrayList<>();
		predicates.add(cb.equal(root.get("status"), TicketStatus.PAYMENT_SUCCESS));
		predicates.add(cb.greaterThanOrEqualTo(root.get("createdDate").as(LocalDate.class), filter.getFromDate()));
		predicates.add(cb.lessThanOrEqualTo(root.get("createdDate").as(LocalDate.class), filter.getToDate()));
		
		if (filter.getCinemaId() != null) {
			predicates.add(cb.equal(root.get("showtime").get("room").get("cinema"), filter.getCinemaId()));
		}
		if (filter.getMovieId() != null) {
			predicates.add(cb.equal(root.get("showtime").get("movie"), filter.getMovieId()));
		}
		query.where(predicates.toArray(new Predicate[0]));
		
		return em.createQuery(query).getResultList();
	}
	
	public ReportOutputDTO getReport(QueryFilter filter) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<Tuple> query = cb.createTupleQuery();
		Root<TicketEntity> root = query.from(TicketEntity.class);
		
		List<Predicate> predicates = getPredicatesByFilter(cb, root, filter);
		predicates.add(cb.equal(root.get("status"), TicketStatus.PAYMENT_SUCCESS));
		
		Subquery<Long> subqueryBookedSeat = query.subquery(Long.class);
		Root<TicketDetailEntity> ticketDetailRoot = subqueryBookedSeat.from(TicketDetailEntity.class);
		subqueryBookedSeat.select(cb.sum(cb.<Long>selectCase()
										   .when(cb.isNotNull(ticketDetailRoot.get("seat")), 1L)
										   .otherwise(0L)))
						  .where(cb.equal(ticketDetailRoot.get("ticket"), root));
		
		query.multiselect(cb.count(root).alias("ticketCount"),
						  cb.sum(root.<Long> get("totalPrice")).alias("revenue"),
						  cb.sum(subqueryBookedSeat).alias("bookedSeat"))
			 .where(predicates.toArray(new Predicate[0]));
		
		Tuple rs = em.createQuery(query).getSingleResult();
		
		//total seat
		CriteriaQuery<ShowtimeEntity> queryShowtime = cb.createQuery(ShowtimeEntity.class);
		Root<TicketEntity> ticketRoot = queryShowtime.from(TicketEntity.class);
		
		List<Predicate> totalSeatPredicates = getPredicatesByFilter(cb, ticketRoot, filter);
		totalSeatPredicates.add(cb.equal(ticketRoot.get("status"), TicketStatus.PAYMENT_SUCCESS));
		
		queryShowtime.select(ticketRoot.get("showtime"))
					 .where(totalSeatPredicates.toArray(new Predicate[0]))
					 .groupBy(ticketRoot.get("showtime"));
		
		List<ShowtimeEntity> showtimes = em.createQuery(queryShowtime).getResultList();
		Long totalSeat = showtimes.stream().reduce(0L, (total, showtime) -> total + showtime.getRoom().getSeats().size(), Long::sum);
		
		ReportOutputDTO reportResult = new ReportOutputDTO();
		reportResult.setTicketCount(rs.get("ticketCount", Long.class));
		reportResult.setRevenue(rs.get("revenue", Long.class));
		reportResult.setBookedSeat(rs.get("bookedSeat", Long.class));
		reportResult.setTotalSeat(totalSeat);
		return reportResult;
	}

	private List<Predicate> getPredicatesByFilter(CriteriaBuilder cb, Root<TicketEntity> root, QueryFilter filter) {
		List<Predicate> predicates = new ArrayList<>();
		
		if (filter.getCinemaId() != null) {
			predicates.add(cb.equal(root.get("showtime").get("room").get("cinema"), filter.getCinemaId()));
		}
		if (filter.getMovieId() != null) {
			predicates.add(cb.equal(root.get("showtime").get("movie"), filter.getMovieId()));
		}
		Expression<String> searchValue = CriteriaBuilderUtil.concat(cb, " ", root.get("createdDate"),
																			 root.get("user").get("fullname"),
																			 root.get("showtime").get("movie").get("name"),
																			 root.get("showtime").get("room").get("cinema").get("name"));
		predicates.add(cb.like(searchValue, "%"+filter.getQ()+"%"));
		
		predicates.add(cb.greaterThanOrEqualTo(root.get("createdDate").as(LocalDate.class), filter.getFromDate()));
		predicates.add(cb.lessThanOrEqualTo(root.get("createdDate").as(LocalDate.class), filter.getToDate()));
		
		return predicates;
	}
}
