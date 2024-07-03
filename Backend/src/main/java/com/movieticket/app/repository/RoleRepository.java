package com.movieticket.app.repository;

import java.util.Optional;

import com.movieticket.app.entity.RoleEntity;

public interface RoleRepository extends BaseRepository<RoleEntity, Long> {
	Optional<RoleEntity> findByName(String name);
}
