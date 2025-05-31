package com.example.backend.Repository;

import com.example.backend.Entity.ChatIsRead;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatIsReadRepository extends JpaRepository<ChatIsRead, Long> {

    // 유저에 해당하는 컬럼 리스트 가져오기
    List<ChatIsRead> findByUser(User user);

    List<ChatIsRead> findByUserAndChatRoomId(User user, ChatRoom chatRoom);


    int countByUserAndChatRoomIdAndIsReadFalse(User user, ChatRoom chatRoom);

}


