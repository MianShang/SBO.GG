package com.example.backend.Controller;

import com.example.backend.Dto.UserChatRoomDto;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.User;
import com.example.backend.Entity.UserChatRoom;
import com.example.backend.Repository.ChatRoomRepository;
import com.example.backend.Repository.UserChatRoomRepository;
import com.example.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserChatRoomController {

    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserChatRoomRepository userChatRoomRepository;

    // 유저가 접속한 채팅방 DB 저장 API
    @PostMapping("/api/add/user/chatroom")
    public void addUserChatRoom(@RequestBody UserChatRoomDto userChatRoomDto) {

        System.out.println("유저 아이디 : " + userChatRoomDto.getUserId());
        System.out.println("방 아이디 : " + userChatRoomDto.getRoomId());

        // 1. userId를 기준으로 User 객체 조회
        User user = userRepository.findByUserId(userChatRoomDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println(user.getUserId());

        // 2. roomId를 기준으로 ChatRoom 객체 조회
        ChatRoom room = chatRoomRepository.findById(userChatRoomDto.getRoomId())
                .orElseThrow(() -> new RuntimeException("ChatRoom not found"));

        // ✅ 3. 이미 저장된 관계가 있는지 확인
        boolean exists = userChatRoomRepository.findByUserAndChatRoom(user, room).isPresent();

        if (exists) {
            System.out.println("이미 존재하는 유저-채팅방 관계입니다.");
            return; // 또는 ResponseEntity로 메시지 반환 가능
        }

        // 3. UserChatRoom 객체 생성
        UserChatRoom userChatRoom = new UserChatRoom();

        userChatRoom.setUser(user);
        userChatRoom.setChatRoom(room);
        
        // DB 저장
        userChatRoomRepository.save(userChatRoom);

        System.out.println("저장 성공");
    }
    
    
    @GetMapping("/api/get/user/chatrooms")
    public List<UserChatRoom> getUserChatRooms(@RequestParam String userId) {
        System.out.println("ㅎㅇㅎㅇ");
        System.out.println(userId);

        List<UserChatRoom> userChatRooms = userChatRoomRepository.findByUser_UserId(userId);

        System.out.println(userChatRooms);

        // 채팅방 ID만 출력
        for (UserChatRoom ucr : userChatRooms) {
            System.out.println(ucr.getChatRoom().getId());
            System.out.println(ucr.getChatRoom().getName());
        }

        return userChatRooms;
    }
}
