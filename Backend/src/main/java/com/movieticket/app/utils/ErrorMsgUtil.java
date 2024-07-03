package com.movieticket.app.utils;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public class ErrorMsgUtil {
	public static Map<String, Object> getError(HttpServletRequest req, Exception ex, Integer status) {
		Map<String, Object> error = new HashMap<>();
		if (status != null) error.put("status", status);
		error.put("path", req.getRequestURI());
		error.put("method", req.getMethod());
		error.put("error", ex.getClass().getSimpleName());
		error.put("message", ex.getMessage());
		return error;
	}
}
