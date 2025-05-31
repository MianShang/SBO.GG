package com.example.backend.Service;

import com.example.backend.Dto.Request.UserRequestDto;
import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    // 이 메서드는 회원가입 유저의 DB 저장 로직 서비스다
    public void saveUser(UserRequestDto user) {
        if (user.getUserId() == null
                || user.getUserEmail()  == null
                || user.getUserPw()     == null
                || user.getUserName()   == null) {

            // input란이 하나라도 null일시 예외처리
            throw new IllegalArgumentException("필수 값 누락");
        }

        User saveUser = new User();

        saveUser.setUserId(user.getUserId());
        saveUser.setUserEmail(user.getUserEmail());
        saveUser.setUserPw(passwordEncoder.encode(user.getUserPw()));
        saveUser.setUserName(user.getUserName());

        // 비밀번호 해싱
        //user.setUserPw(passwordEncoder.encode(user.getUserPw()));

        // DB 저장
        userRepository.save(saveUser);
    }

}
