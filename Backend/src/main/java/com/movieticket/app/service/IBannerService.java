package com.movieticket.app.service;

import java.io.IOException;
import java.util.List;

import com.movieticket.app.dto.BannerDTO;
import com.movieticket.app.entity.BannerEntity;

public interface IBannerService {
	List<BannerEntity> findAll();
	List<BannerEntity> findByActiveTrue();
	
	BannerEntity findOne(Long id);
	
	BannerEntity create(BannerDTO cinemaInfo) throws IllegalStateException, IOException;
	
	BannerEntity update(Long id, BannerDTO cinemaInfo) throws IllegalStateException, IOException;
	
	int delete(Long[] ids);
}
