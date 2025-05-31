package com.example.backend.Controller;

import com.example.backend.Entity.ChatIsRead;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.User;
import com.example.backend.Entity.UserChatRoom;
import com.example.backend.Repository.ChatIsReadRepository;
import com.example.backend.Repository.ChatRoomRepository;
import com.example.backend.Repository.UserChatRoomRepository;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Service.ChatIsReadService;
import com.example.backend.Websocket.RealTimeUserManagement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
public class ChatIsReadController {

    private final UserChatRoomRepository userChatRoomRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatIsReadRepository chatIsReadRepository;
    private final UserRepository userRepository;

    private final ChatIsReadService chatIsReadService;

    // 채팅방을 저장한 유저들에게 안읽은 채팅 개수를 표현하기 위한 저장 API
    @PostMapping("/api/chat/isread")
    public void postChatIsRead(@RequestBody Map<String, String> request) {

        chatIsReadService.saveChatList(request);
    }


    // 저장한 채팅방의 안읽은 채팅이 몇개인지 출력하는 API
    @GetMapping("/api/get/chat/no-read")
    public int getUnreadCount(@RequestParam Map<String, String> request) {

        int unReadChat = chatIsReadService.countUnReadChat(request);

        return unReadChat;
    }


    // 채팅방의 메세지를 읽음 처리 함 (DB에서 삭제)
    @PostMapping("/api/chat/read")
    public void postChatRead(@RequestBody Map<String, String> request) {

        chatIsReadService.setRead(request);
    }
}
