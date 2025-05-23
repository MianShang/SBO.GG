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

        // userId를 기준으로 User 객체 조회
        User user = userRepository.findByUserId(userChatRoomDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // roomId를 기준으로 ChatRoom 객체 조회
        ChatRoom room = chatRoomRepository.findById(userChatRoomDto.getRoomId())
                .orElseThrow(() -> new RuntimeException("ChatRoom not found"));

        // 이미 저장된 관계가 있는지 확인
        // User, ChatRoom 둘 다 해당하는 컬럼이 있는지 Select
        boolean exists = userChatRoomRepository.findByUserAndChatRoom(user, room).isPresent();

        // 이미 저장한 채팅방일시 저장 X
        if (exists) { return; }

        // UserChatRoom 객체 생성
        UserChatRoom userChatRoom = new UserChatRoom();

        // 객체에 set
        userChatRoom.setUser(user);
        userChatRoom.setChatRoom(room);
        
        // DB 저장
        userChatRoomRepository.save(userChatRoom);

        System.out.println("저장 성공");
    }
    

    // 유저가 저장한 채팅방 불러오는 API
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

        // UserDto 리스트 선언
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

    // 유저가 저장한 채팅방 삭제하는 API
    @PostMapping("/api/user/delete/userchatroom")
    public void deleteUserChatRoom(@RequestBody Map<String, Long> body) {

        // Axios 요청의 body의 roomId 데이터 get
        Long roomId = body.get("roomId");

        // 해당 유저가 저장한 채팅방 컬럼을 기본키로 지정하여 삭제한다
        userChatRoomRepository.deleteById(roomId);
    }


}
