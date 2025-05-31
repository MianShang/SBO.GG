package com.example.backend.Dto.Request;

import lombok.Getter;
import lombok.Setter;

/*
*   UserChatRoomRequestDto 저장 요청은 유저 ID와 방ID를 사용한다.
*
*
*/

@Getter
@Setter
public class UserChatRoomRequestDto {
    private String userId;
    private String roomId;
}
