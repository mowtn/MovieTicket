package com.movieticket.app.config;

import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class PersistentConfig {
	
	@Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
        	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        	if (auth == null) return Optional.empty();
        	return Optional.of(auth.getName());
        };
    }
}
