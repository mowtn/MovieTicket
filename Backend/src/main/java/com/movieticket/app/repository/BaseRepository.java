package com.movieticket.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface BaseRepository<T, ID> extends JpaRepository<T, ID> {
	List<T> findByActive(boolean active);
	Page<T> findByActive(boolean active, Pageable pageable);
	List<T> findByActive(boolean active, Sort sort);
	
	int deleteByIdIn(Long[] ids);
	
	@Modifying
	@Query("update #{#entityName} e set e.active = :active where e.id IN :ids")
	int updateActiveByIdIn(Long[] ids, boolean active);

	@Modifying
	@Query("update #{#entityName} e set e.active = :active where e.id = :id")
	int updateActiveById(Long id, boolean active);
}
