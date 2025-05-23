package com.example.backend.Entity;

import jakarta.persistence.*;

@Entity
public class ChatList {
    @Id
    @GeneratedValue
    private long id;                    // 기본키 컬럼 ID

    private String chatContent;         // 채팅 내용

    @ManyToOne
    @JoinColumn(name="chat_room_id")
    private ChatRoom chatRoom;          // 해당 채팅방

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;                  // 메세지 저송자 유저



}
