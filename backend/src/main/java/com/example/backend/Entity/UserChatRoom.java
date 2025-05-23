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

    @ManyToOne                          // User 테이블과 다대일 관계
    @JoinColumn(name = "user_id")       // FK 컬럼명
    private User user;


    @ManyToOne                          // ChatRoom 테이블과 다대일 관계
    @JoinColumn(name = "chat_room_id")  // DB에 저장될 컬럼명
    private ChatRoom chatRoom;
}
