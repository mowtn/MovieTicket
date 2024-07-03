package com.movieticket.app.service;

import java.io.UnsupportedEncodingException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface IPaymentService {
	String getPaymentURL(HttpServletRequest req, Long ticketId, long totalPrice) throws UnsupportedEncodingException;
	Map<String, String> paymentIPN(HttpServletRequest req);
	Map<String, Object> paymentReturn(HttpServletRequest req);
}
