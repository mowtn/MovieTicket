package com.movieticket.app.api.web;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movieticket.app.dto.PasswordDTO;
import com.movieticket.app.dto.TicketDTO;
import com.movieticket.app.dto.UserDTO;
import com.movieticket.app.entity.TicketEntity;
import com.movieticket.app.entity.UserEntity;
import com.movieticket.app.security.AuthCookie;
import com.movieticket.app.security.UserPrincipal;
import com.movieticket.app.service.IPaymentService;
import com.movieticket.app.service.ITicketService;
import com.movieticket.app.service.IUserService;
import com.movieticket.app.utils.CookieUtil;

@RestController
@RequestMapping(value = "profile")
public class ProfileAPI {
	@Autowired PasswordEncoder passwordEncoder;
	@Autowired IUserService userService;
	@Autowired ITicketService ticketService;
	@Autowired IPaymentService paymentService;
	
	@GetMapping
	UserEntity getCurrentUser() {
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return principal.getUser();
	}
	
	@PutMapping
	UserEntity updateCurrentUser(@RequestBody UserDTO userDTO) {
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return userService.update(principal.getUser().getId(), userDTO, false);
	}

	@PutMapping("change-pass")
	private int changePassword(@RequestBody PasswordDTO passwordDTO) {
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		UserEntity user = principal.getUser();
		if (!passwordDTO.getNewPass().equals(passwordDTO.getRetypePass())) throw new IllegalArgumentException("Mật khẩu nhập lại không chính xác");
		if (!passwordEncoder.matches(passwordDTO.getOldPass(), user.getPassword())) throw new IllegalArgumentException("Mật khẩu không chính xác");
		return userService.changePassword(user.getId(), passwordDTO.getNewPass());
	}
	
	@GetMapping("ticket")
	List<TicketEntity> getCurrentUserTicket() {
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return ticketService.findByUserId(principal.getUser().getId());
	}
	
	@PostMapping("logout")
	String logout(HttpServletRequest request, HttpServletResponse response) {
		Cookie authCookie = CookieUtil.getCookie(AuthCookie.NAME, request);
		authCookie.setPath("/");
		authCookie.setMaxAge(0);
		response.addCookie(authCookie);
		return "Đăng xuất thành công";
	}
	
	@PostMapping("payment")
	String payment(HttpServletRequest req, @RequestBody TicketDTO ticketDTO) throws UnsupportedEncodingException {
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		ticketDTO.setUserId(principal.getUser().getId());
		TicketEntity ticket = ticketService.create(ticketDTO);
		long totalPrice = ticket.getDetails().stream().reduce(0L, (total, detail) -> total + detail.getPrice() * detail.getQuantity(), Long::sum);
		return paymentService.getPaymentURL(req, ticket.getId(), totalPrice);
	}
	
	@GetMapping("vnpay_return")
	Map<String, Object> VnpayReturn(HttpServletRequest req) {
		return paymentService.paymentReturn(req);
	}
	
}
