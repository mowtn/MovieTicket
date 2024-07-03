package com.movieticket.app.api.web;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.movieticket.app.dto.UserDTO;
import com.movieticket.app.entity.BannerEntity;
import com.movieticket.app.entity.FoodEntity;
import com.movieticket.app.entity.SeatEntity;
import com.movieticket.app.entity.UserEntity;
import com.movieticket.app.service.IBannerService;
import com.movieticket.app.service.IFoodService;
import com.movieticket.app.service.IPaymentService;
import com.movieticket.app.service.ISeatService;
import com.movieticket.app.service.IUserService;
import com.movieticket.app.storage.StorageService;

@RestController
@RequestMapping
public class HomeAPI {
	@Autowired IUserService userService;
	@Autowired ISeatService seatService;
	@Autowired IFoodService foodService;
	@Autowired IBannerService bannerService;
	@Autowired IPaymentService paymentService;
	@Autowired StorageService storageService;

	@PostMapping("register")
	@ResponseStatus(HttpStatus.CREATED)
	UserEntity register(@RequestBody UserDTO userInfo) {
		userInfo.setRoleNames(null);
		return userService.create(userInfo);
	}
	
	@GetMapping("seat")
	List<SeatEntity> getSeatByRoomId(Long roomId, Long showtimeId){
		return seatService.findByRoomIdAndActiveTrueWithOccupied(roomId, showtimeId);
	}
	
	@GetMapping("food")
	List<FoodEntity> getAllFood(){
		return foodService.findByActiveTrue();
	}
	
	@GetMapping("banner")
	List<BannerEntity> getAll() {
		return bannerService.findByActiveTrue();
	}
	
	@GetMapping("vnpay_ipn")
	Map<String, String> VnpayIPN(HttpServletRequest req) {
		return paymentService.paymentIPN(req);
	}

	@GetMapping("/upload/{filename:.+}")
	@ResponseBody
	public ResponseEntity<Resource> serveFile(@PathVariable String filename) throws IOException {
		Resource file = storageService.loadAsResource(filename);
		if (file == null)
			return ResponseEntity.notFound().build();
		return ResponseEntity.ok().contentType(MediaTypeFactory.getMediaType(file).orElse(MediaType.IMAGE_JPEG)).body(file);
	}
}
