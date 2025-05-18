package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UserChatRoom {
    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id") // FK 컬럼명
    private User user;

    // 채팅방과의 연결
    @ManyToOne
    @JoinColumn(name = "chat_room_id") // DB에 저장될 컬럼명
    private ChatRoom chatRoom; // ✅ 변수명이 "chatRoom"이어야 함
}
