package com.example.backend.Repository;

import com.example.backend.Entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
    List<ChatRoom> findByNameContainingIgnoreCase(String keyword);
}
