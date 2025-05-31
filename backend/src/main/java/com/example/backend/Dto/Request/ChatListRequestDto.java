package com.example.backend.Dto.Request;

import lombok.Getter;
import lombok.Setter;

// ============================================================
// 프론트로부터 메세지 저장 요청시 사용되는 DTO
// ============================================================

@Getter
@Setter
public class ChatListRequestDto {
    
    private String chatContent;     // 채팅 내용
    private String chatRoom;        // 해당 채팅방
    private String userId;          // 메세지 전송 유저
}
