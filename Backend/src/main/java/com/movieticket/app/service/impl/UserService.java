package com.movieticket.app.service.impl;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movieticket.app.dto.PageDTO;
import com.movieticket.app.dto.QueryFilter;
import com.movieticket.app.dto.UserDTO;
import com.movieticket.app.entity.RoleEntity;
import com.movieticket.app.entity.UserEntity;
import com.movieticket.app.repository.RoleRepository;
import com.movieticket.app.repository.UserRepository;
import com.movieticket.app.service.IUserService;

@Service
@Transactional
public class UserService implements IUserService {
	@Autowired PasswordEncoder passwordEncoder;
	@Autowired UserRepository userRepository;
	@Autowired RoleRepository roleRepository;

	public PageDTO<UserEntity> findAll(QueryFilter filter){
		Page<UserEntity> page = userRepository.findBySearchValueContains(filter.getQ(), filter.toPageable());
		return PageDTO.from(page);
	}
	
	public List<UserEntity> findAll(){
		return userRepository.findAll(Sort.by(Direction.DESC, "id"));
	}
	
	public UserEntity findOne(Long id) {
		return userRepository.findById(id).orElseThrow(()-> new NoSuchElementException("Không tìm thấy người dùng"));
	}
	
	public UserEntity findByUsername(String username) {
		return userRepository.findByUsername(username).orElseThrow(()-> new NoSuchElementException("Không tìm thấy người dùng"));
	}
	
	public UserEntity create(UserDTO userInfo) {
		userRepository.findByUsername(userInfo.getUsername())
					.ifPresent(x-> { throw new IllegalArgumentException("Tài khoản đã tồn tại!"); });
		
		UserEntity user = new UserEntity();
		BeanUtils.copyProperties(userInfo, user, "password");
		user.setPassword(passwordEncoder.encode(userInfo.getPassword()));
		updateRoles(user, userInfo.getRoleNames());
		return userRepository.save(user);
	}
	
	public UserEntity update(Long id, UserDTO userInfo, boolean isUpdateRole) {
		UserEntity user = findOne(id);
		BeanUtils.copyProperties(userInfo, user, "password","username");
		if (isUpdateRole) updateRoles(user, userInfo.getRoleNames());
		return user;
	}
	
	public int changePassword(Long id, String newPassword) {
		return userRepository.updatePasswordById(id, passwordEncoder.encode(newPassword));
	}
	
	public int delete(Long[] ids) {
		return userRepository.deleteByIdIn(ids);
	}

	public void updateRoles(UserEntity user, List<String> roleNames) {
		if (roleNames == null) return;
		Set<RoleEntity> roles = roleNames.stream()
				.map(name -> roleRepository.findByName(name).orElseThrow(()-> new NoSuchElementException("Cant find role with name " + name)))
				.collect(Collectors.toSet());
		user.getRoles().clear();
		user.getRoles().addAll(roles);
	}
}
