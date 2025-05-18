package com.example.backend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class ChatRoom {
    @Id
    private String id;
    private String name;
    
    // 기본 생성자
    protected ChatRoom() { }

    // 생성자
    public ChatRoom(String id, String name) {
        this.id = id;
        this.name = name;
    }
}
