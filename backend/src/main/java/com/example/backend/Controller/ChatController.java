package com.example.backend.Controller;


import com.example.backend.Entity.ChatList;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.UserChatRoom;
import com.example.backend.Repository.ChatListRepository;
import com.example.backend.Repository.ChatRoomRepository;
import com.example.backend.Repository.UserChatRoomRepository;
import com.example.backend.Websocket.RealTimeUserManagement;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.context.event.EventListener;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

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

    // 실시간 채팅방 접속 유저 목록 (roomId -> Set of userIds)
    private final Map<String, Set<String>> activeUsersByRoom = new ConcurrentHashMap<>();


    // 구독된 채팅방에 메세지 보내는 API
    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public Map<String, String> sendMessage(@DestinationVariable String roomId, @Payload Map<String, String> payload) {

        String name = payload.get("name");
        String message = payload.get("message");

        // 메세지가 전송된 채팅방의 ID로 그 방을 저장한 유저 목록을 리스트에 담음
        List<UserChatRoom> userChatRooms = userChatRoomRepository.findByChatRoom_Id(roomId);

        // 해당 방을 저장한 유저들에게 전부 신호 전송
        // simpMessagingTemplate 사용
        for (UserChatRoom userChatRoom : userChatRooms) {
            
            // User ID만 가져오기
            String userId = userChatRoom.getUser().getUserId();
            
            // 메세지를 보낸 사람을 제외하고 메세지를 보냄
            if (!userId.equals(name)) { 
                simpMessagingTemplate.convertAndSend("/topic/chat/summary/" + userId,
                        // 채팅방 아이디와 메세지 내용을 보냄
                        Map.of("chatRoomId", roomId, "lastMessage", message));
            }
        }

        // 메세지로 유저 ID, 메세지 내용 보냄
        return Map.of("name", name, "message", message);
    }

    // STOMP WebSocket 연결 시 유저 등록
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        String userId = accessor.getFirstNativeHeader("userId");
        String roomId = accessor.getFirstNativeHeader("roomId");

        if (userId != null && roomId != null) {

            // 전역 유저 관리 Map 사용
            RealTimeUserManagement.activeUsersByRoom.putIfAbsent(roomId, ConcurrentHashMap.newKeySet());
            RealTimeUserManagement.activeUsersByRoom.get(roomId).add(userId);

            System.out.println("🟢 유저 입장: " + userId + "  방 ID : " + roomId);

            System.out.println("실시간 해당 채팅방 유저 목록");
            System.out.println(RealTimeUserManagement.activeUsersByRoom.getOrDefault(roomId, Set.of()));
        }
    }

    // STOMP WebSocket 연결해제 시 유저 삭제
    @MessageMapping("/disconnect")
    public void handleManualDisconnect(@Payload Map<String, String> payload) {

        String userId = payload.get("userId");
        String roomId = payload.get("roomId");

        if (userId != null && roomId != null) {

            // HashMap에서 삭제
            RealTimeUserManagement.activeUsersByRoom.getOrDefault(roomId, new HashSet<>()).remove(userId);

            System.out.println("🔴 유저 퇴장: " + userId + "  방 ID : " + roomId);

            System.out.println("실시간 해당 채팅방 유저 목록");
            System.out.println(RealTimeUserManagement.activeUsersByRoom.getOrDefault(roomId, Set.of()));
        }
    }

    // STOMP WebSocket 연결 종료 시 유저 제거
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        String userId = accessor.getFirstNativeHeader("userId");
        String roomId = accessor.getFirstNativeHeader("roomId");

        if (userId != null && roomId != null && activeUsersByRoom.containsKey(roomId)) {
            activeUsersByRoom.get(roomId).remove(userId);
            System.out.println("🔴 유저 퇴장: " + userId + " <- 방: " + roomId);
        }
    }

    // 채팅방별 실시간 접속 유저 조회 API
    @GetMapping("/active-users/{roomId}")
    public Set<String> getActiveUsers(@PathVariable String roomId) {
        return activeUsersByRoom.getOrDefault(roomId, Collections.emptySet());
    }




    // 채팅방 전체 조회 API
    @GetMapping("/rooms")
    public List<ChatRoom> getChatRooms(@RequestParam(required = false) String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return chatRoomRepository.findAll();
        } else {
            return chatRoomRepository.findByNameContainingIgnoreCase(keyword);
        }
    }

    // 채팅방 생성
    @PostMapping("/rooms")
    public ChatRoom createRoom(@RequestBody Map<String, String> chatRoomData) {
        String roomName = chatRoomData.get("chatName");
        String gameName = chatRoomData.get("gameName");

        // 생성자를 통해 방 id, 이름 객체 생성
        ChatRoom room = new ChatRoom(UUID.randomUUID().toString(), roomName);
        room.setGameName(gameName);

        // DB 저장
        return chatRoomRepository.save(room);
    }


}
