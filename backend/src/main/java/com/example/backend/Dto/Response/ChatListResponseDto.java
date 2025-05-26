package com.example.backend.Dto.Response;

import lombok.Getter;
import lombok.Setter;
import java.util.Date;

// ============================================================
// 프론트로부터 메세지 불러오기 요청시 사용되는 DTO
// ============================================================

@Getter
@Setter
public class ChatListResponseDto {
    private String name;
    private String message;
    private Date chatDate;
}
