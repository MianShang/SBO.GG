package com.example.backend.Controller;

import com.example.backend.Dto.LOLDto;
import com.example.backend.Service.LOLService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/riot")
public class LOLController {

    // Riot API 연동을 위한 서비스 의존성 주입
    private final LOLService lolService;

    // 게임코드(Hide on bush#KR1)를 기반으로 라이엇 전적 조회
    @GetMapping("/stats/by-gamecode")
    public ResponseEntity<?> getStatsByGameCode(@RequestParam String gameCode) {
        try {
            // 게임코드가 "#" 구분자가 없는 잘못된 형식이면 에러 반환
            if (!gameCode.contains("#")) {
                return ResponseEntity.badRequest().body("잘못된 게임코드 형식입니다. (예: Hide on bush#KR1)");
            }

            // 소환사명(name)과 태그(tag) 분리
            String[] parts = gameCode.split("#", 2);
            String name = parts[0];
            String tag = parts[1];

            System.out.println("🎯 name: " + name);
            System.out.println("🎯 tag: " + tag);

            // 라이엇 API를 통해 전적 데이터 조회
            LOLDto riotStats = lolService.getFullRiotStats(name, tag);

            // 결과 반환
            return ResponseEntity.ok(riotStats);

        } catch (Exception e) {
            // 예외 발생 시 500 에러 반환
            return ResponseEntity.internalServerError().body("전적 조회 실패: " + e.getMessage());
        }
    }
}
