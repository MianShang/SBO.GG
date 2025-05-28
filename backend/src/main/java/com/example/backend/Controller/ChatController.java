package com.example.backend.Controller;


import com.example.backend.Entity.ChatList;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.UserChatRoom;
import com.example.backend.Repository.ChatListRepository;
import com.example.backend.Repository.ChatRoomRepository;
import com.example.backend.Repository.UserChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
@RestController // REST API도 처리
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    private final ChatListRepository chatListRepository;
    private final UserChatRoomRepository userChatRoomRepository;

    // 구독된 채팅방에 메세지 보내는 API
    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public Map<String, String> sendMessage(@DestinationVariable String roomId, @Payload Map<String, String> payload) {

        String name = payload.get("name");
        String message = payload.get("message");

        // 메세지를 보냄과 동시에 안읽은 채팅 개수 판별을 위함
        List<UserChatRoom> userChatRooms = userChatRoomRepository.findByChatRoom_Id(roomId);

        // 해당 방을 저장한 유저들에게 전부 신호 전송
        // simpMessagingTemplate 사용
        for (UserChatRoom userChatRoom : userChatRooms) {

            String userId = userChatRoom.getUser().getUserId();

            System.out.println(userId + " 전송 완료");

            if (!userId.equals(name)) { // 보낸 사람 제외 가능
                simpMessagingTemplate.convertAndSend("/topic/chat/summary/" + userId,
                        Map.of("chatRoomId", roomId, "lastMessage", message, "unreadCount", 1));
            }
        }


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
