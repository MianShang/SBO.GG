package com.example.backend.Controller;

import com.example.backend.Entity.ChatIsRead;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.User;
import com.example.backend.Entity.UserChatRoom;
import com.example.backend.Repository.ChatIsReadRepository;
import com.example.backend.Repository.ChatRoomRepository;
import com.example.backend.Repository.UserChatRoomRepository;
import com.example.backend.Repository.UserRepository;
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


    // 채팅방을 저장한 유저들에게 안읽은 채팅 개수를 표현하기 위한 API
    @PostMapping("/api/chat/isread")
    public void postChatIsRead(@RequestBody Map<String, String> request) {
        // Map에서 가져옴
        String chatRoomId = request.get("chatRoom");
        String chatContent = request.get("chatContent");

        // 채팅방을 저장한 유저들을 찾기 위해 특정 방 Id의 컬럼을 가져온다
        List<UserChatRoom> userChatRooms = userChatRoomRepository.findByChatRoom_Id(chatRoomId);

        // 채팅방을 저장한 유저들을 저장하기 위한 List
        List<User> users =  new ArrayList<>();

        // User 엔티티만 추출
        for (UserChatRoom ucr : userChatRooms) {
            // 유저만 가져오기
            User user = ucr.getUser();

            // 리스트에 Add
            users.add(user);
        }

        // 어떤 채팅방에 쌓인 알림인지 알기 위한 Find
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);

        // 리스트에있는 유저 만큼 반복하여 저장
        for(User user : users){
            ChatIsRead chatIsRead = new ChatIsRead();

            chatIsRead.setChatRoomId(chatRoom.get());
            chatIsRead.setUser(user);
            chatIsRead.setContent(chatContent);

            // DB 저장
            chatIsReadRepository.save(chatIsRead);
        }
    }

    // 저장한 채팅방의 안읽은 채팅이 몇개인지 출력하는 API
    @GetMapping("/api/get/chat/no-read")
    public int getUnreadCount(@RequestParam Map<String, String> request) {
        String userId = request.get("userId");
        String chatRoomId = request.get("chatRoom");

        Optional<User> user = userRepository.findByUserId(userId);
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);

        int noReadChat = chatIsReadRepository.countByUserAndChatRoomIdAndIsReadFalse(user.get(), chatRoom.get());

        List<ChatIsRead> chatIsReads = chatIsReadRepository.findByUserAndChatRoomId(user.get(), chatRoom.get());

        String lastChat = chatIsReads.get(chatIsReads.size() - 1 ).getContent();

        // 맵으로 담아서 보내기
        Map<Integer, String> test = new HashMap<>();

        test.put(noReadChat, lastChat);

        System.out.println(test);

        return noReadChat;
    }

    // 채팅방의 메세지를 읽음 처리 함
    @PostMapping("/api/chat/read")
    public void postChatRead(@RequestBody Map<String, String> request) {

        // Map에서 데이터 가져오기
        String userId = request.get("userId");
        String chatRoomId = request.get("chatRoom");

        // 유저와 채팅방 엔티티를 찾음
        Optional<User> user = userRepository.findByUserId(userId);
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);

        // 유저와 채팅방에 해당하는 컬럼 리스트를 찾음
        List<ChatIsRead> chatIsReads = chatIsReadRepository.findByUserAndChatRoomId(user.get(), chatRoom.get());

        for (ChatIsRead cir : chatIsReads) {
            cir.setRead(true);
        }

        // 한 번에 저장 (Batch 저장)
        chatIsReadRepository.saveAll(chatIsReads);
    }



}
