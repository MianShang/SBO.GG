package com.example.backend.Repository;

import com.example.backend.Entity.ChatList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatListRepository extends JpaRepository<ChatList, Long> {

    // 채팅방 아이디로 컬럼 검색
    List<ChatList> findByChatRoom_Id(String chatRoom);
}
