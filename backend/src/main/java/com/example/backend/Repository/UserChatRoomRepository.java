package com.example.backend.Repository;

import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.User;
import com.example.backend.Entity.UserChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserChatRoomRepository extends JpaRepository<UserChatRoom, Long> {

    Optional<UserChatRoom> findByUserAndChatRoom(User user, ChatRoom chatRoom);

    List<UserChatRoom> findByUser_UserId(String userId);

    // 채팅방 아이디로 채팅방 데이터 가져오기
    List<UserChatRoom> findByChatRoom_Id(String roomId);

}
