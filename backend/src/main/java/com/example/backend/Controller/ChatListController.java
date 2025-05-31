package com.example.backend.Controller;

import com.example.backend.Dto.Request.ChatListRequestDto;
import com.example.backend.Dto.Response.ChatListResponseDto;
import com.example.backend.Entity.ChatList;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.User;
import com.example.backend.Repository.ChatListRepository;
import com.example.backend.Repository.ChatRoomRepository;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Service.ChatListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class ChatListController {

    private final ChatListRepository chatListRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository     userRepository;

    private final ChatListService chatListService;

    // 유저의 채팅 목록을 저장하는 API
    @PostMapping("/api/user/add/userchatlist")
    public ResponseEntity<String> addUserChatList(@RequestBody ChatListRequestDto chatListRequestDto) {

        boolean isSaveChat = chatListService.saveChat(chatListRequestDto);

        if (isSaveChat) {
            return ResponseEntity.ok(chatListRequestDto.getUserId());
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // 채팅방의 채팅 목록을 가져오는 API
    @GetMapping("/api/user/request/userchatlist")
    public ResponseEntity<List<ChatListResponseDto>> getUserChatList(@RequestParam String roomId) {

        List<ChatListResponseDto> chatListResponseDtos = chatListService.getChatList(roomId);

        return ResponseEntity.ok(chatListResponseDtos);
    }
}
