package com.example.backend.Controller;

import com.example.backend.Dto.UserDto;
import com.example.backend.Security.MyUserDetailsService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {
    // 로그인 여부

    @GetMapping("/api/check-login")
    public ResponseEntity<Void> checkLogin(HttpSession session, Authentication auth) {
        // 로그인 세션 여부
        Object context = session.getAttribute("SPRING_SECURITY_CONTEXT");

        if (context != null) {
            // 유저 정보
            MyUserDetailsService.CustomUserDetails user = (MyUserDetailsService.CustomUserDetails) auth.getPrincipal();
            //System.out.println("유저정보 " + user.toString());

            return ResponseEntity.ok().build(); // 로그인 되어 있음
        } else {
            return ResponseEntity.status(401).build(); // 로그인 안 되어 있음
        }
    }

    // 유저 정보 받아오기
    @GetMapping("/api/user/get-data")
    public ResponseEntity<UserDto> getData(Authentication auth) {
        // UserDetailService
        MyUserDetailsService.CustomUserDetails user = (MyUserDetailsService.CustomUserDetails) auth.getPrincipal();
        // 테스트용 출력
        //System.out.println(user.toString());

        //UserDTO
        UserDto userDto = new UserDto();

        userDto.setUserId(user.userId);
        userDto.setUserName(user.getUsername());
        userDto.setUserEmail(user.userEmail);

        return ResponseEntity.ok(userDto);
    }
}
