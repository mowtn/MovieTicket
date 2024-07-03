package com.movieticket.app.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movieticket.app.constants.Common;
import com.movieticket.app.dto.FoodDTO;
import com.movieticket.app.dto.PageDTO;
import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.entity.FoodEntity;
import com.movieticket.app.repository.FoodRepository;
import com.movieticket.app.service.IFoodService;
import com.movieticket.app.storage.StorageService;

@Service
@Transactional
public class FoodService implements IFoodService {
	@Autowired FoodRepository foodRepository;
	@Autowired StorageService storageService;
	
	public List<FoodEntity> findAll(){
		return foodRepository.findAll(Sort.by(Direction.DESC, "id"));
	}
	
	public List<FoodEntity> findByActiveTrue(){
		return foodRepository.findByActive(true, Sort.by(Direction.DESC, "id"));
	}
	
	public PageDTO<FoodEntity> findAll(QueryFilter filter){
		Page<FoodEntity> page = foodRepository.findBySearchValueContains(filter.getQ(), filter.toPageable());
		return PageDTO.from(page);
	}
	
	public FoodEntity findOne(Long id) {
		return foodRepository.findById(id).orElseThrow(()-> new NoSuchElementException("Không tìm thấy đồ ăn"));
	}
	
	public FoodEntity create(FoodDTO foodInfo) throws IllegalStateException, IOException {
		FoodEntity food = new FoodEntity();
		BeanUtils.copyProperties(foodInfo, food);
		if (foodInfo.getThumbnailFile() != null && !foodInfo.getThumbnailFile().isEmpty()) {
			String filename = storageService.store(foodInfo.getThumbnailFile());
			food.setThumbnail(filename);
		} else food.setThumbnail(Common.DEFAULT_IMAGE_NAME);
		return foodRepository.save(food);
	}
	
	public FoodEntity update(Long id, FoodDTO foodInfo) throws IllegalStateException, IOException {
		FoodEntity food = findOne(id);
		BeanUtils.copyProperties(foodInfo, food);
		if (foodInfo.getThumbnailFile() != null && !foodInfo.getThumbnailFile().isEmpty()) {
			String filename = storageService.store(foodInfo.getThumbnailFile());
			food.setThumbnail(filename);
		}
		if (food.getThumbnail() == null) food.setThumbnail(Common.DEFAULT_IMAGE_NAME);
		return food;
	}
	
	public int delete(Long[] ids) {
		return foodRepository.deleteByIdIn(ids);
	}
}
