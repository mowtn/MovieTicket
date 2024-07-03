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
import com.movieticket.app.dto.RoomDTO;
import com.movieticket.app.entity.RoomEntity;
import com.movieticket.app.service.IRoomService;

@RestController
@RequestMapping(value = "admin/room")
public class RoomAPI {
	@Autowired IRoomService roomService;
	
	@GetMapping
	List<RoomEntity> getAll(Long cinemaId) {
		return roomService.findAll(cinemaId);
	}
	
	@GetMapping("{id}")
	RoomEntity getOne(@PathVariable Long id) {
		return roomService.findOne(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_CINEMA+"')")
	RoomEntity create(@RequestBody RoomDTO roomInfo) {
		return roomService.create(roomInfo);
	}
	
	@PutMapping("{id}")
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_CINEMA+"')")
	RoomEntity update(@PathVariable Long id, @RequestBody RoomDTO roomInfo) {
		return roomService.update(id, roomInfo);
	}
	
	@DeleteMapping
	@PreAuthorize("hasAuthority('"+RoleName.MANAGE_CINEMA+"')")
	int delete(@RequestBody Long[] ids) {
		return roomService.delete(ids);
	}
}