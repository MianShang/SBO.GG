package com.example.backend.Controller;

import com.example.backend.Dto.Request.GameCodeRequestDto;
import com.example.backend.Entity.User;
import com.example.backend.Entity.UserGameCode;
import com.example.backend.Repository.UserGameCodeRepository;
import com.example.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
/*
    임시로 쥬어 전적 검색을 위한 컨트롤러이기에 서비스 레이어 분리는 추후에 한다.

 */
@RestController
@RequiredArgsConstructor
public class UserGameCodeController {
    private final UserGameCodeRepository userGameCodeRepository;
    private final UserRepository userRepository;

    // 유저 전적 저장을 위한 API
    @PostMapping("/api/save/gamecode")
    public ResponseEntity<?> saveUserGameCode(@RequestBody GameCodeRequestDto gameCodeRequestDto){

        System.out.println(gameCodeRequestDto.getGameCode());
        System.out.println(gameCodeRequestDto.getUserId());
        System.out.println(gameCodeRequestDto.getGameName());

        // 유저 찾기
        Optional<User> user = userRepository.findByUserId(gameCodeRequestDto.getUserId());
        
        // 이미 저장된 게임 - 게임코드 있는지 체크
        Optional<UserGameCode> isPresnetUserGameCode
                = userGameCodeRepository.findByUserAndGameName(user.get(), gameCodeRequestDto.getGameName());
        
        // 이미 해당 게임코드가 존재시 기존 데이터를 덮어씌움
        if(isPresnetUserGameCode.isPresent()){
            System.out.println("새로운 게임 코드로 업데이트");
            
            // 기본키 가져옴
            Long upDatePri = isPresnetUserGameCode.get().getId();
            
            // 새로운 데이터로 Update
            UserGameCode newUserGameCode = new UserGameCode();
            
            newUserGameCode.setId(upDatePri);

            newUserGameCode.setUser(user.get());
            newUserGameCode.setGameName(gameCodeRequestDto.getGameName());
            newUserGameCode.setGameCode(gameCodeRequestDto.getGameCode());

            userGameCodeRepository.save(newUserGameCode);
            
            return ResponseEntity.ok("새로운 게임 코드 업데이트 성공");
        }

        UserGameCode newUserGameCode = new UserGameCode();

        newUserGameCode.setUser(user.get());
        newUserGameCode.setGameName(gameCodeRequestDto.getGameName());
        newUserGameCode.setGameCode(gameCodeRequestDto.getGameCode());

        userGameCodeRepository.save(newUserGameCode);

        return ResponseEntity.ok("저장 성공");
    }


    // 로그인한 유저의 게임 코드 검색을 위한 API
    @GetMapping("/api/get/user/gamecode")
    public ResponseEntity<List<UserGameCode>> getUserGameCode(@RequestParam String userId){


        Optional<User> user = userRepository.findByUserId(userId);

        List<UserGameCode> userGameCodes = userGameCodeRepository.findByUser(user.get());

        return ResponseEntity.ok(userGameCodes);

    }


    // 채팅방의 유저 리스트에서 특정 유저의 게임 코드와 게임 이름으로 전적 검색위한 API
    @GetMapping("/api/get/user/gamedata")
    public ResponseEntity<?> getUserGameData(@RequestParam String userId, @RequestParam String gameName){
        // 유저 검색
        Optional<User> user = userRepository.findByUserId(userId);
        
        // 유저 ID와 게임 이름으로 검색
        Optional<UserGameCode> userGameCode = userGameCodeRepository.findByUserAndGameName(user.get(), gameName);

        if (userGameCode.isEmpty()) {
            return ResponseEntity.ok("null");
        }

        return ResponseEntity.ok(userGameCode.get());
    }


}
