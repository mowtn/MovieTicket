package com.movieticket.app.security;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.movieticket.app.constants.RoleName;
import com.movieticket.app.utils.JwtUtil;

class AuthRequest {
	public String username;
	public String password;
	public boolean remember;
}

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
	@Autowired
	AuthenticationManager authenticationManager;
	AuthRequest credentials;
	
	public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
		super();
		this.authenticationManager = authenticationManager;
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		try {
			credentials = new ObjectMapper().readValue(request.getReader(), AuthRequest.class);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(credentials.username, credentials.password));
		return auth;
	}
	
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		String token = JwtUtil.generateToken(authResult.getName());
		Cookie cookie = new Cookie(AuthCookie.NAME, URLEncoder.encode(AuthCookie.TOKEN_PREFIX + token, "UTF-8"));
		cookie.setHttpOnly(true);
		cookie.setPath("/");
		if (credentials.remember) cookie.setMaxAge(24*60*60);
		response.addCookie(cookie);
		
		response.setContentType("application/json");
		Map<String, Object> res = new HashMap<>();
		res.put("message", "Đăng nhập thành công");
		res.put("isAdmin", authResult.getAuthorities().stream().anyMatch(role -> role.getAuthority().equals(RoleName.SHOW_ADMIN)));
		new ObjectMapper().writeValue(response.getOutputStream(), res);
	}
	
}
