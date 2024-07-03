package com.movieticket.app.security;

import java.io.IOException;
import java.net.URLDecoder;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.movieticket.app.entity.UserEntity;
import com.movieticket.app.repository.UserRepository;
import com.movieticket.app.utils.CookieUtil;
import com.movieticket.app.utils.JwtUtil;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter {
	AuthenticationManager authenticationManager;
	UserRepository userRepository;

	public JwtAuthorizationFilter(AuthenticationManager authenticationManager, UserRepository userRepository) {
		super(authenticationManager);
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		Cookie authCookie = CookieUtil.getCookie(AuthCookie.NAME, request);
		try {
			if (authCookie == null || authCookie.getValue() == null) {
				chain.doFilter(request, response);
				return;
			}
			String token = URLDecoder.decode(authCookie.getValue(), "UTF-8").replace(AuthCookie.TOKEN_PREFIX, "");
			UserEntity user = userRepository.findByUsername(JwtUtil.verifyToken(token)).orElse(null);
			if (user != null) {
				UserPrincipal principal = new UserPrincipal(user);
				Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
				SecurityContextHolder.getContext().setAuthentication(auth);
			}
			chain.doFilter(request, response);
		} catch (Exception ex) {
//			authCookie.setMaxAge(0);
//			authCookie.setPath("/");
//			response.addCookie(authCookie);
			chain.doFilter(request, response);
		}
	}
}
