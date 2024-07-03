package com.movieticket.app.api.admin;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.movieticket.app.constants.RoleName;
import com.movieticket.app.dto.FoodDTO;
import com.movieticket.app.dto.PageDTO;
import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.entity.FoodEntity;
import com.movieticket.app.service.IFoodService;

@RestController
@RequestMapping(value = "admin/food")
public class FoodAPI {
	@Autowired IFoodService foodService;
	
	@GetMapping
	List<FoodEntity> getAll() {
		return foodService.findAll();
	}
	
	@GetMapping("page")
	PageDTO<FoodEntity> getAll(QueryFilter filter) {
		return foodService.findAll(filter);
	}
	
	@GetMapping("{id}")
	FoodEntity getOne(@PathVariable Long id) {
		return foodService.findOne(id);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_FOOD+"')")
	FoodEntity create(@ModelAttribute FoodDTO foodInfo) throws IllegalStateException, IOException {
		return foodService.create(foodInfo);
	}
	
	@PutMapping(value = "{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_FOOD+"')")
	FoodEntity update(@PathVariable Long id, @ModelAttribute FoodDTO foodInfo) throws IllegalStateException, IOException {
		return foodService.update(id, foodInfo);
	}
	
	@DeleteMapping
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_FOOD+"')")
	int delete(@RequestBody Long[] ids) {
		return foodService.delete(ids);
	}
}