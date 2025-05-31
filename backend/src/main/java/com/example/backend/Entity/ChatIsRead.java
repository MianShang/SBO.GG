package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ChatIsRead {
    @Id
    @GeneratedValue
    private Long id;

    private boolean isRead = false;     // 기본값으로 안읽음
    private String content;

    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoomId;        // 메세지 전송한 채팅방

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;                  // 채팅방을 저장한 유저 목록
}
