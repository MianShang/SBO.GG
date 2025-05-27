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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    public int getChatIsRead(@RequestParam Map<String, String> request) {

        // Map에서 가져옴
        String userId = request.get("userId");
        String chatRoomId = request.get("chatRoom");

        System.out.println(userId);
        System.out.println(chatRoomId);

        // 파라미터로 들어온 유저ID로 유저 엔티티를 찾음
        Optional<User> user = userRepository.findByUserId(userId);

        // 채팅방 가져오기
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);

        // 위의 두개에 포함되는 채팅 리스트 가져오기
        List<ChatIsRead> chatIsReads = chatIsReadRepository.findByUserAndChatRoomId(user.get(), chatRoom.get());

        System.out.println(chatRoom.get().getName() + " 방의 안읽은거 : " + chatIsReads.size());

        return chatIsReads.size();

    }





/*


    // 유저의 안읽은 채팅 몇개인지 체킹 테스트
    @GetMapping("api/test6")
    public void test6(){
        // 김용반 아이디로 테스트
        Optional<User> user = userRepository.findById(2L);
        // 차은우김용반강동원 방으로 테스트
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById("30d74417-e143-432b-80b0-ddcafe283650");

        // 위의 두개에 포함되는 채팅 리스트 가져오기
        List<ChatIsRead> chatIsReads = chatIsReadRepository.findByUserAndChatRoomId(user.get(), chatRoom.get());

        int i = 0;

        for(ChatIsRead chatIsRead : chatIsReads){
            if(!chatIsRead.isRead()){
                i++;
            }
        }
        System.out.println("안읽은거 : " + i);

    }

    @PostMapping("/api/test7")
    public void test7(){
        // 김용반 아이디로 테스트
        Optional<User> user = userRepository.findById(2L);
        // 차은우김용반강동원 방으로 테스트
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById("30d74417-e143-432b-80b0-ddcafe283650");

        // 위의 두개에 포함되는 채팅 리스트 가져오기
        List<ChatIsRead> chatIsReads = chatIsReadRepository.findByUserAndChatRoomId(user.get(), chatRoom.get());

        // isRead 값을 true로 설정하고 저장
        for (ChatIsRead cir : chatIsReads) {
            cir.setRead(true); // 또는 cir.setIsRead(true);
        }

        // 한 번에 저장 (Batch 저장)
        chatIsReadRepository.saveAll(chatIsReads);


    }


 */

}
