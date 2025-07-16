package com.example.backend.Controller;

import com.example.backend.Dto.DNFDto;
import com.example.backend.Service.DNFService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URLEncoder;
@RestController
@RequiredArgsConstructor
@RequestMapping("/dnf")
public class DnfController {

    private final DNFService dnfService;

    // /dnf/stats/by-gamecode?gameCode=카인-던전앤훈타
    @GetMapping("/stats/by-gamecode")
    public ResponseEntity<?> getDNFStats(@RequestParam String gameCode) {
        try {
            // 서버-닉네임
            if (!gameCode.contains("-")) {
                return ResponseEntity.badRequest().body("게임 코드 형식이 잘못되었습니다. 예: 카인-닉네임");
            }

            String[] parts = gameCode.split("-", 2);
            String serverId = parts[0].trim();//.toLowerCase();
            String nickname = parts[1].trim();

            DNFDto dto = dnfService.getDNF(serverId, nickname);

            if (dto == null) {
                return ResponseEntity.status(404).body("전적 정보를 찾을 수 없습니다.");
            }
            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("던파 전적 조회 중 오류 발생: " + e.getMessage());
        }
    }

}
