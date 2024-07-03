package com.movieticket.app.service.impl;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movieticket.app.constants.Common;
import com.movieticket.app.dto.PageDTO;
import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.dto.ReportOutputDTO;
import com.movieticket.app.dto.TicketDTO;
import com.movieticket.app.entity.FoodEntity;
import com.movieticket.app.entity.SeatEntity;
import com.movieticket.app.entity.ShowtimeEntity;
import com.movieticket.app.entity.TicketDetailEntity;
import com.movieticket.app.entity.TicketEntity;
import com.movieticket.app.repository.FoodRepository;
import com.movieticket.app.repository.SeatRepository;
import com.movieticket.app.repository.ShowtimeRepository;
import com.movieticket.app.repository.TicketDetailRepository;
import com.movieticket.app.repository.TicketRepository;
import com.movieticket.app.repository.UserRepository;
import com.movieticket.app.service.ITicketService;

@Service
@Transactional
public class TicketService implements ITicketService {
	@Autowired TicketRepository ticketRepository;
	@Autowired TicketDetailRepository ticketDetailRepository;
	@Autowired UserRepository userRepository;
	@Autowired ShowtimeRepository showtimeRepository;
	@Autowired SeatRepository seatRepository;
	@Autowired FoodRepository foodRepository;
	
	public List<TicketEntity> findAllByFilter(QueryFilter filter) {
		return ticketRepository.findAllByFilter(filter);
	}

	public PageDTO<TicketEntity> findByFilter(QueryFilter filter) {
		Page<TicketEntity> page = ticketRepository.findByFilter(filter);
		return PageDTO.from(page);
	}
	
	public ReportOutputDTO getReport(QueryFilter filter) {
		return ticketRepository.getReport(filter);
	}
	
	public List<TicketEntity> findByUserId(Long userId){
		return ticketRepository.findByUserIdAndActiveTrueOrderByCreatedDateDesc(userId);
	}
	
	public TicketEntity findOne(Long id) {
		return ticketRepository.findById(id).orElseThrow(()-> new NoSuchElementException("Không tìm thấy vé"));
	}
	
	private List<TicketDetailEntity> getTicketDetails(TicketDTO ticketDTO) {
		List<SeatEntity> occupiedSeats = seatRepository.findOccupiedByShowtimeId(ticketDTO.getShowtimeId());
		
		if (!ticketDTO.getDetails().stream().anyMatch(details -> details.getSeatId() != null))
			throw new IllegalArgumentException("Không tìm thấy thông tin ghế");
		
		return ticketDTO.getDetails().stream().map(details -> {
			TicketDetailEntity ticketDetail = new TicketDetailEntity();
			BeanUtils.copyProperties(details, ticketDetail);
			if (details.getSeatId() != null) {
				SeatEntity seat = seatRepository.findById(details.getSeatId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy ghế"));
				boolean isOccupied = occupiedSeats.stream().anyMatch(s -> s.getId() == seat.getId());
				if (isOccupied) throw new IllegalArgumentException("Ghế đã được đặt!");
				ticketDetail.setSeat(seat);
				ticketDetail.setPrice(seat.getType().getPrice());
			} else if (details.getFoodId() != null) {
				FoodEntity food = foodRepository.findById(details.getFoodId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy đồ ăn"));
				ticketDetail.setFood(food);
				ticketDetail.setPrice(food.getPrice());
			} else throw new IllegalArgumentException("Không có thông tin đặt vé");
			return ticketDetail;
		}).collect(Collectors.toList());
	}
	
	public TicketEntity create(TicketDTO ticketDTO) {
		TicketEntity ticket = new TicketEntity();
		ticket.setUser(userRepository.findById(ticketDTO.getUserId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy người dùng")));
		ShowtimeEntity showtime = showtimeRepository.findById(ticketDTO.getShowtimeId()).orElseThrow(()-> new NoSuchElementException("Không tìm thấy lịch chiếu"));
		if (showtime.getStartTime().minusMinutes(Common.ORDER_TICKET_VALID_BEFORE_MINUTES).isBefore(LocalDateTime.now())) throw new IllegalArgumentException("Đã quá hạn đặt vé, vui lòng đặt tại quầy thanh toán!");
		ticket.setShowtime(showtime);
		ticket.setActive(false);
		
		List<TicketDetailEntity> ticketDetails = getTicketDetails(ticketDTO);
		TicketEntity savedTicket = ticketRepository.save(ticket);
		ticketDetails.forEach(detail -> detail.setTicket(savedTicket));;
		ticketDetailRepository.saveAll(ticketDetails);
		savedTicket.setDetails(new HashSet<>(ticketDetails));
		return savedTicket;
	}
	
	public TicketEntity update(Long id, TicketDTO ticketDTO) {
		TicketEntity ticket = findOne(id);
		BeanUtils.copyProperties(ticketDTO, ticket);
		return ticket;
	}
	
	public int updateStatus(Long id, int status) {
		return ticketRepository.updateStatusById(id, status);
	}
	
	public int delete(Long[] ids) {
		return ticketRepository.deleteByIdIn(ids);
	}
}
