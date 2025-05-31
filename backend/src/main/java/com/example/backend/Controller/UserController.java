package com.example.backend.Controller;


import com.example.backend.Dto.Request.UserRequestDto;
import com.example.backend.Dto.UserDto;
import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Security.MyUserDetailsService;
import com.example.backend.Service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final UserService userService;

    // 회원가입 API
    @PostMapping("/api/user/join")
    public ResponseEntity<String> userJoin(@RequestBody UserRequestDto user) {
        try {
            // Service 레이어 분리
            userService.saveUser(user);
            return ResponseEntity.ok("회원가입 성공");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 로그인 성공시 반환
    @GetMapping("/loginOk")
    public ResponseEntity<String> loginOk() {
        return ResponseEntity.ok("로그인 성공");
    }

    // 로그아웃 성공시 반환
    @GetMapping("/logoutOk")
    public ResponseEntity<String> logoutOk() {
        return ResponseEntity.ok("로그아웃 성공");
    }



}