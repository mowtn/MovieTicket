package com.movieticket.app.utils;

import java.util.Date;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;

public class JwtUtil {
	public static final String SECRET = "supersecret";
	public static final Algorithm ALGORITHM = Algorithm.HMAC256(SECRET);
	public static final int EXP_MILLIS = 24*60*60*1000;
	
	public static String generateToken(String subject) throws JWTCreationException {
		return JWT.create()
			.withSubject(subject)
			.withExpiresAt(new Date(System.currentTimeMillis() + EXP_MILLIS))
			.sign(ALGORITHM);
	}

	public static String verifyToken(String token) throws JWTVerificationException {
		return JWT.require(ALGORITHM).build().verify(token).getSubject();
	}
}
