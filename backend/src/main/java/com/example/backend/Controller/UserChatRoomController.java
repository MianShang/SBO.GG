package com.example.backend.Controller;

import com.example.backend.Dto.Request.UserChatRoomRequestDto;
import com.example.backend.Dto.Response.UserResponseDto;
import com.example.backend.Dto.UserChatRoomDto;
import com.example.backend.Dto.UserDto;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.User;
import com.example.backend.Entity.UserChatRoom;
import com.example.backend.Repository.ChatRoomRepository;
import com.example.backend.Repository.UserChatRoomRepository;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Service.UserChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    private final UserChatRoomService userChatRoomService;

    // 유저가 접속한 채팅방 DB 저장 API
    @PostMapping("/api/add/user/chatroom")
    public ResponseEntity<String> addUserChatRoom(@RequestBody UserChatRoomRequestDto userChatRoomDto) {

        try {
            userChatRoomService.saveUserChatRoom(userChatRoomDto);
            return ResponseEntity.ok("저장 성공");

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    

    // 유저가 저장한 채팅방 불러오는 API
    @GetMapping("/api/get/user/chatrooms")
    public ResponseEntity<List<UserChatRoom>> getUserChatRooms(@RequestParam String userId) {

        // 유저 ID가 저장한 채팅방 목록 select
        List<UserChatRoom> userChatRooms = userChatRoomService.getUserChatRooms(userId);

        return ResponseEntity.ok(userChatRooms);
    }

    // 채팅방에 포함된 유저 목록 가져오는 API
    @GetMapping("/api/get/user/chatlist")
    public ResponseEntity<List<UserResponseDto>> getUserChatList(@RequestParam String roomId) {

        List<UserResponseDto> userResponseDtos = userChatRoomService.getChatRoomUsers(roomId);

        return ResponseEntity.ok(userResponseDtos);
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
