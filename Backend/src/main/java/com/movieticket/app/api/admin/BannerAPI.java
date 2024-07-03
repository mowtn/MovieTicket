package com.movieticket.app.api.admin;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

import com.movieticket.app.dto.BannerDTO;
import com.movieticket.app.entity.BannerEntity;
import com.movieticket.app.service.IBannerService;

@RestController(value = "adminBanner")
@RequestMapping(value = "admin/banner")
public class BannerAPI {
	@Autowired IBannerService bannerService;
	
	@GetMapping
	List<BannerEntity> getAll() {
		return bannerService.findAll();
	}
	
	@GetMapping("{id}")
	BannerEntity getOne(@PathVariable Long id) {
		return bannerService.findOne(id);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@ResponseStatus(HttpStatus.CREATED)
	BannerEntity create(@ModelAttribute BannerDTO bannerDTO) throws IllegalStateException, IOException {
		return bannerService.create(bannerDTO);
	}

	@PutMapping(value = "{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	BannerEntity update(@PathVariable Long id, @ModelAttribute BannerDTO bannerDTO) throws IllegalStateException, IOException {
		return bannerService.update(id, bannerDTO);
	}
	
	@DeleteMapping
	int delete(@RequestBody Long[] ids) {
		return bannerService.delete(ids);
	}
}