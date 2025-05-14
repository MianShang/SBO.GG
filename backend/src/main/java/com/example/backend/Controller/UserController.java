package com.example.backend.Controller;


import com.example.backend.Dto.UserDto;
import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Security.MyUserDetailsService;
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

    // 회원가입
    @PostMapping("/api/user/join")
    public ResponseEntity<String> userJoin(@RequestBody User user) {

        // 입력칸 null 방지
        if(user.getUserId() == null
                || user.getUserEmail() == null
                || user.getUserPw() == null
                || user.getUserName() == null) {
            return ResponseEntity.badRequest().build();
        }

        // 비밀번호 해싱
        user.setUserPw(passwordEncoder.encode(user.getUserPw()));

        // DB 저장
        userRepository.save(user);

        return ResponseEntity.ok("회원가입 성공");
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

    // 로그인 여부
    @GetMapping("/api/check-login")
    public ResponseEntity<Void> checkLogin(HttpSession session) {
        Object context = session.getAttribute("SPRING_SECURITY_CONTEXT");

        if (context != null) {
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
        System.out.println(user.toString());

        //UserDTO
        UserDto userDto = new UserDto();

        userDto.setUserId(user.userId);
        userDto.setUserName(user.getUsername());

        return ResponseEntity.ok(userDto);
    }

}