package com.movieticket.app.api.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movieticket.app.entity.RoleEntity;
import com.movieticket.app.repository.RoleRepository;

@RestController
@RequestMapping(value = "admin/role")
public class RoleAPI {
	@Autowired RoleRepository roleRepository;
	
	@GetMapping
	List<RoleEntity> getAll(){
		return roleRepository.findAll();
	}
}
