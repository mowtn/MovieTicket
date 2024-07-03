package com.movieticket.app.service;

import java.util.List;

import com.movieticket.app.dto.PageDTO;
import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.dto.UserDTO;
import com.movieticket.app.entity.UserEntity;

public interface IUserService {
	PageDTO<UserEntity> findAll(QueryFilter filter);
	
	List<UserEntity> findAll();
	
	UserEntity findOne(Long id);
	
	UserEntity findByUsername(String username);
	
	UserEntity create(UserDTO userInfo);
	
	UserEntity update(Long id, UserDTO userInfo, boolean isUpdateRole);
	
	int changePassword(Long id, String newPassword);
	
	int delete(Long[] ids);

	void updateRoles(UserEntity user, List<String> roleNames);
}
