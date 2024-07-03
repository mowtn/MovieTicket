package com.movieticket.app.service.impl;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movieticket.app.config.VnPayConfig;
import com.movieticket.app.constants.TicketStatus;
import com.movieticket.app.entity.TicketEntity;
import com.movieticket.app.repository.TicketRepository;
import com.movieticket.app.service.IPaymentService;

@Service
@Transactional
public class VnPayService implements IPaymentService {
	@Autowired
	TicketRepository ticketRepository;
	@Autowired
	VnPayConfig vnpayConfig;
	
	public String getPaymentURL(HttpServletRequest req, Long ticketId, long totalPrice) throws UnsupportedEncodingException {
		Map<String, String> vnp_Params = new HashMap<>();
		vnp_Params.put("vnp_Version", vnpayConfig.vnp_Version);
		vnp_Params.put("vnp_Command", vnpayConfig.vnp_Command);
		vnp_Params.put("vnp_TmnCode", vnpayConfig.vnp_TmnCode);
		vnp_Params.put("vnp_Amount", String.valueOf(totalPrice*100));
		vnp_Params.put("vnp_CurrCode", vnpayConfig.vnp_CurrCode);
	    vnp_Params.put("vnp_Locale", vnpayConfig.vnp_Locale);
		vnp_Params.put("vnp_ReturnUrl", vnpayConfig.vnp_Returnurl);
		vnp_Params.put("vnp_IpAddr", vnpayConfig.getIpAddress(req));
		
		String vnp_TxnRef = ticketId.toString();
		vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
		vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: #" + vnp_TxnRef);
		vnp_Params.put("vnp_OrderType", vnpayConfig.vnp_OrderType);
		Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
		vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));
		cld.add(Calendar.MINUTE, 15);
		vnp_Params.put("vnp_ExpireDate", formatter.format(cld.getTime()));
		
		String queryUrl = vnpayConfig.getQueryUrl(vnp_Params);
		String vnp_SecureHash = vnpayConfig.hmacSHA512(vnpayConfig.vnp_HashSecret, queryUrl);
		queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
		String paymentUrl = vnpayConfig.vnp_PayUrl + "?" + queryUrl;
		return paymentUrl;
	}
	
	public String signPayment(HttpServletRequest req) throws UnsupportedEncodingException {
		Map<String, String> fields = new HashMap<>();
		Enumeration<String> params = req.getParameterNames();
		while (params.hasMoreElements()) {
		    String fieldName = params.nextElement();
		    String fieldValue = req.getParameter(fieldName);
		    if ((fieldValue != null) && (fieldValue.length() > 0))
		    	fields.put(fieldName, fieldValue);
		}
		if (fields.containsKey("vnp_SecureHashType")) fields.remove("vnp_SecureHashType");
		if (fields.containsKey("vnp_SecureHash")) fields.remove("vnp_SecureHash");
		return vnpayConfig.hashAllFields(fields);
	}
	
	public Map<String, String> paymentIPN(HttpServletRequest req) {
		try {
			String vnp_SecureHash = req.getParameter("vnp_SecureHash");
			String signValue = signPayment(req);
			Map<String, String> res = new HashMap<>();
			
			if (signValue.equals(vnp_SecureHash)) {
				Long ticketId = Long.valueOf(req.getParameter("vnp_TxnRef"));
				TicketEntity ticket = ticketRepository.findById(ticketId).orElse(null);
				if (ticket != null) {
					ticket.setActive(true);
					if (req.getParameter("vnp_ResponseCode").equals("00")) {
						ticket.setStatus(TicketStatus.PAYMENT_SUCCESS);
					} else {
						ticket.setStatus(TicketStatus.PAYMENT_FAILED);
					}
					res.put("RspCode", "00");
					res.put("Message", "Confirm Success");
				} else {
					res.put("RspCode", "01");
					res.put("Message", "Ticket not found");
				}
			} else {
				res.put("RspCode", "97");
				res.put("Message", "Invalid Checksum");
			}
			return res;
		} catch (UnsupportedEncodingException e) {
			Map<String, String> res = new HashMap<>();
			res.put("RspCode", "99");
			res.put("Message", "Unknow error");
			return res;
		}
	}
	
	public Map<String, Object> paymentReturn(HttpServletRequest req) {
		Map<String, Object> res = new HashMap<>();
		try {
			String vnp_SecureHash = req.getParameter("vnp_SecureHash");
			String signValue = signPayment(req);
			Long ticketId = Long.valueOf(req.getParameter("vnp_TxnRef"));
			
			if (signValue.equals(vnp_SecureHash)) {
				TicketEntity ticket = ticketRepository.findById(ticketId).orElse(null);
				if (ticket != null) {
					res.put("ticket", ticket);
				}
				if (req.getParameter("vnp_ResponseCode").equals("00")) {
					res.put("status", TicketStatus.PAYMENT_SUCCESS);
					res.put("message", "Thanh toán thành công");
				} else {
					res.put("status", TicketStatus.PAYMENT_FAILED);
					res.put("message", "Thanh toán thất bại");
				}
			} else {
				res.put("message", "Thông tin không hợp lệ");
			}
		} catch (UnsupportedEncodingException e) {
			res.put("message", "Thông tin không hợp lệ");
		}
		return res;
	}
}
