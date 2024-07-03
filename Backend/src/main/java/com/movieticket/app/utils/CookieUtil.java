package com.movieticket.app.utils;

import java.util.Arrays;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public class CookieUtil {
	public static Cookie getCookie(String name, HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null) return null;
		Cookie cookie = Arrays.asList(cookies).stream().filter(c -> c.getName().equals(name)).findAny().orElse(null);
		return cookie;
	}
}
