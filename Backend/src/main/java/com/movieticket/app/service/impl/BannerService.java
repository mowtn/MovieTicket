package com.movieticket.app.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movieticket.app.constants.Common;
import com.movieticket.app.dto.BannerDTO;
import com.movieticket.app.entity.BannerEntity;
import com.movieticket.app.repository.BannerRepository;
import com.movieticket.app.service.IBannerService;
import com.movieticket.app.storage.StorageService;

@Service
@Transactional
public class BannerService implements IBannerService {
	@Autowired BannerRepository bannerRepository;
	@Autowired StorageService storageService;
	
	public List<BannerEntity> findAll(){
		return bannerRepository.findAll(Sort.by(Direction.ASC, "id"));
	}
	
	public List<BannerEntity> findByActiveTrue(){
		return bannerRepository.findByActive(true, Sort.by(Direction.ASC, "id"));
	}
	
	public BannerEntity findOne(Long id) {
		return bannerRepository.findById(id).orElseThrow(()-> new NoSuchElementException("Không tìm thấy banner"));
	}
	
	public BannerEntity create(BannerDTO bannerDTO) throws IllegalStateException, IOException {
		BannerEntity banner = new BannerEntity();
		BeanUtils.copyProperties(bannerDTO, banner);
		if (bannerDTO.getThumbnailFile() != null && !bannerDTO.getThumbnailFile().isEmpty()) {
			String filename = storageService.store(bannerDTO.getThumbnailFile());
			banner.setThumbnail(filename);
		} else banner.setThumbnail(Common.DEFAULT_IMAGE_NAME);
		return bannerRepository.save(banner);
	}
	
	public BannerEntity update(Long id, BannerDTO bannerDTO) throws IllegalStateException, IOException {
		BannerEntity banner = findOne(id);
		BeanUtils.copyProperties(bannerDTO, banner);
		if (bannerDTO.getThumbnailFile() != null && !bannerDTO.getThumbnailFile().isEmpty()) {
			String filename = storageService.store(bannerDTO.getThumbnailFile());
			banner.setThumbnail(filename);
		}
		if (banner.getThumbnail() == null) banner.setThumbnail(Common.DEFAULT_IMAGE_NAME);
		return banner;
	}
	
	public int delete(Long[] ids) {
		return bannerRepository.deleteByIdIn(ids);
	}
}
