package com.example.backend.Repository;

import com.example.backend.Entity.User;
import com.example.backend.Entity.UserGameCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserGameCodeRepository extends JpaRepository<UserGameCode, Long> {

    // 유저를 인자로 저장된 게임 코드들 찾기
    List<UserGameCode> findByUser(User user);

    // 중복저장 방지 위한 유저 - 게임 이름 으로 중복 여부 검사
    Optional<UserGameCode> findByUserAndGameName(User user, String gameName);
}
