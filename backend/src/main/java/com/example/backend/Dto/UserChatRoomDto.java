package com.example.backend.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserChatRoomDto {
    private String userId;
    private String roomId;
    private String gameName;

    // UserChatRoomDto를 상속받아 채팅방 유저 리스트에 보낼 Dto
    class UserChatRoomListDto extends UserChatRoomDto {

        // 유저 전적 검색을 위한 게임별 유저 코드 (Ex 배틀태그)
        private String userGameCode;

        public UserChatRoomListDto(String userGameCode) {
            // 모든 멤버에 유저 게임 코드만 추가 (상속)
            super();

            this.userGameCode = userGameCode;
        }

    }
}
