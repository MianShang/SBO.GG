package com.example.backend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ChatRoom {
    @Id
    private String id;
    private String name;
    protected ChatRoom() {
    }

    // 생성자
    public ChatRoom(String id, String name) {
        this.id = id;
        this.name = name;
    }
}
