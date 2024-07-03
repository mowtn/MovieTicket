package com.movieticket.app.api.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.movieticket.app.constants.RoleName;
import com.movieticket.app.dto.PageDTO;
import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.dto.UserDTO;
import com.movieticket.app.entity.UserEntity;
import com.movieticket.app.service.IUserService;

@RestController
@RequestMapping(value = "admin/user")
public class UserAPI {
	@Autowired IUserService userService;
	
	@GetMapping
	List<UserEntity> getAll(){
		return userService.findAll();
	}
	
	@GetMapping("page")
	PageDTO<UserEntity> getAll(QueryFilter filter) {
		return userService.findAll(filter);
	}
	
	@GetMapping("{id}")
	UserEntity getOne(@PathVariable Long id) {
		return userService.findOne(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_USER+"')")
	UserEntity create(@RequestBody UserDTO userInfo) {
		return userService.create(userInfo);
	}
	
	@PutMapping("{id}")
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_USER+"')")
	UserEntity update(@PathVariable Long id, @RequestBody UserDTO userInfo) {
		return userService.update(id, userInfo, true);
	}
	
	@PutMapping("{id}/changepassword")
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_USER+"')")
	int changePassword(@PathVariable Long id, @RequestBody String newPassword) {
		return userService.changePassword(id, newPassword);
	}
	
	@DeleteMapping
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_USER+"')")
	int delete(@RequestBody Long[] ids) {
		return userService.delete(ids);
	}
	
	@PostMapping("update-roles/{id}")
	UserEntity updateRoles(@PathVariable Long id, @RequestBody List<String> roleNames) {
		UserEntity user = userService.findOne(id);
		userService.updateRoles(user, roleNames);
		return user;
	}
}