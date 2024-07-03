package com.movieticket.app.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.movieticket.app.entity.UserEntity;

public interface UserRepository extends BaseRepository<UserEntity, Long> {
	Page<UserEntity> findBySearchValueContains(String q, Pageable pageable);
	
	
	Optional<UserEntity> findByUsername(String username);
	
	@Modifying
	@Query("update #{#entityName} e set e.password = :newPassword where e.id = :id")
	int updatePasswordById(Long id, String newPassword);
}
