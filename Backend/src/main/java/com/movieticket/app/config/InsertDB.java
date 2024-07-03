//package com.movieticket.app.config;
//
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import com.movieticket.app.constants.RoleName;
//import com.movieticket.app.dto.UserDTO;
//import com.movieticket.app.entity.RoleEntity;
//import com.movieticket.app.repository.RoleRepository;
//import com.movieticket.app.service.impl.UserService;
//
//import lombok.extern.slf4j.Slf4j;
//
//@Component
//@Slf4j
//public class InsertDB implements CommandLineRunner {
//	@Autowired RoleRepository roleRepository;
//	@Autowired UserService userService;
//
//	@Override
//	public void run(String... args) throws Exception {
//		List<RoleEntity> roleEntities = new ArrayList<>();
//		roleEntities.add(new RoleEntity(RoleName.SHOW_ADMIN, "Xem trang quản trị"));
//		roleEntities.add(new RoleEntity(RoleName.MANAGE_CINEMA, "Cập nhật rạp, phòng và chỗ ngồi"));
//		roleEntities.add(new RoleEntity(RoleName.MANAGE_FOOD, "Cập nhật đồ ăn"));
//		roleEntities.add(new RoleEntity(RoleName.MANAGE_MOVIE, "Cập nhật movie"));
//		roleEntities.add(new RoleEntity(RoleName.MANAGE_SHOWTIME, "Cập nhật lịch chiếu"));
//		roleEntities.add(new RoleEntity(RoleName.MANAGE_USER, "Cập nhật người dùng"));
//		roleEntities.add(new RoleEntity(RoleName.MANAGE_TICKET, "Cập nhật vé"));
//		roleRepository.saveAll(roleEntities);
//		UserDTO u = new UserDTO();
//		u.setUsername("admin");
//		u.setPassword("admin");
//		u.setFullname("");
//		u.setEmail("");
//		u.setPhoneNumber("");
//		u.setRoleNames(Arrays.asList(RoleName.SHOW_ADMIN, RoleName.MANAGE_USER));
//		userService.create(u);
//		log.info("Success fully create admin account with username: "+u.getUsername()+", password: "+u.getPassword());
//	}
//
//}
