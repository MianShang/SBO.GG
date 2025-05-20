package com.example.backend.Controller;

import com.example.backend.Dto.UserChatRoomDto;
import com.example.backend.Dto.UserDto;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.User;
import com.example.backend.Entity.UserChatRoom;
import com.example.backend.Repository.ChatRoomRepository;
import com.example.backend.Repository.UserChatRoomRepository;
import com.example.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

        // 유저 ID가 저장한 채팅방 목록 select
        List<UserChatRoom> userChatRooms = userChatRoomRepository.findByUser_UserId(userId);

        return userChatRooms;
    }

    // 채팅방에 포함된 유저 목록 가져오는 API
    @GetMapping("/api/get/user/chatlist")
    public List<UserDto> getUserChatList(@RequestParam String roomId) {

        // RoomId를 통해 UserChatRoom 컬럼 select
        List<UserChatRoom> userChatRooms = userChatRoomRepository.findByChatRoom_Id(roomId);

        List<UserDto> userDtos = new ArrayList<>();

        // List<UserChatRoom> userChatRooms의 유저 데이터만 UserDto로 return
        for (UserChatRoom ucr : userChatRooms) {
            User user = ucr.getUser();

            // UserDto 선언
            UserDto dto = new UserDto();

            // UserDto Set
            dto.setUserId(user.getUserId());
            dto.setUserName(user.getUserName());
            dto.setUserEmail(user.getUserEmail());

            // List Add
            userDtos.add(dto);
        }
        return userDtos;
    }

    @PostMapping("/api/user/delete/userchatroom")
    public void deleteUserChatRoom(@RequestBody Map<String, Long> body) {

        Long roomId = body.get("roomId");

        // 해당 유저가 저장한 채팅방 컬럼을 기본키로 지정하여 삭제한다
        userChatRoomRepository.deleteById(roomId);
    }

}
