package com.example.backend.Controller;


import com.example.backend.Entity.ChatRoom;
import com.example.backend.Repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
@RestController // REST API도 처리
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    // 구독된 채팅방에 메세지 보내는 API
    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public Map<String, String> sendMessage(@DestinationVariable String roomId, @Payload Map<String, String> payload) {

        String name = payload.get("name");
        String message = payload.get("message");

        return Map.of("name", name, "message", message);
    }

    // 채팅방 전체 조회 API
    @GetMapping("/rooms")
    public List<ChatRoom> getChatRooms() {

        // 채팅방 전체 조회
        List<ChatRoom> chatRooms = chatRoomRepository.findAll();

        return chatRooms;
    }

    // 채팅방 생성
    @PostMapping("/rooms")
    public ChatRoom createRoom(@RequestParam String name) {

        // 생성자를 통해 방 id, 이름 객체 생성
        ChatRoom room = new ChatRoom(UUID.randomUUID().toString(), name);

        // DB 저장
        return chatRoomRepository.save(room);
    }


}
