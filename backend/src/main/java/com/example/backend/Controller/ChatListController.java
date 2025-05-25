package com.example.backend.Controller;

import com.example.backend.Dto.Request.ChatListRequestDto;
import com.example.backend.Dto.Response.ChatListResponseDto;
import com.example.backend.Entity.ChatList;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.User;
import com.example.backend.Repository.ChatListRepository;
import com.example.backend.Repository.ChatRoomRepository;
import com.example.backend.Repository.UserRepository;
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
    private final UserRepository userRepository;


    @PostMapping("/api/user/add/userchatlist")
    public ResponseEntity<String> addUserChatList(@RequestBody ChatListRequestDto chatListRequestDto) {

        // DTO로 넘어온 방 ID로 찾음
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatListRequestDto.getChatRoom());

        // DTO로 넘어온 userId로 유저 찾음
        Optional<User> user = userRepository.findByUserId(chatListRequestDto.getUserId());

        // 만일 없는 객체일시 저장 x
        if(chatRoom.isEmpty() || user.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Entity 객체 생성
        ChatList chatList = new ChatList();

        chatList.setChatContent(chatListRequestDto.getChatContent());
        chatList.setChatRoom(chatRoom.get());
        chatList.setUser(user.get());

        // DB 저장
        chatListRepository.save(chatList);

        return ResponseEntity.ok("메세지 저장 성공");
    }

    @GetMapping("/api/user/request/userchatlist")
    public List<ChatListResponseDto> getUserChatList(@RequestParam String roomId) {
        System.out.println(roomId);

        List<ChatList> chatList = chatListRepository.findByChatRoom_Id(roomId);

        List<ChatListResponseDto> chatListResponseDtoList = new ArrayList<>();

        for (ChatList chatList1 : chatList) {
            ChatListResponseDto chatListResponseDto = new ChatListResponseDto();

            chatListResponseDto.setMessage(chatList1.getChatContent());
            chatListResponseDto.setName(chatList1.getUser().getUserId());
            chatListResponseDto.setChatDate(chatList1.getChatDate());

            chatListResponseDtoList.add(chatListResponseDto);
        }

        return chatListResponseDtoList;

    }
}
