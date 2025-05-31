package com.example.backend.Service;

import com.example.backend.Entity.ChatIsRead;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.User;
import com.example.backend.Entity.UserChatRoom;
import com.example.backend.Repository.ChatIsReadRepository;
import com.example.backend.Repository.ChatRoomRepository;
import com.example.backend.Repository.UserChatRoomRepository;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Websocket.RealTimeUserManagement;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ChatIsReadService {

    private final UserChatRoomRepository userChatRoomRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatIsReadRepository chatIsReadRepository;
    private final UserRepository userRepository;


    public boolean saveChatList( Map<String, String> request){
        // Map에서 가져옴
        String chatRoomId = request.get("chatRoom");
        String chatContent = request.get("chatContent");

        // 채팅방을 저장한 유저들을 찾기 위해 특정 방 Id의 컬럼을 가져온다
        List<UserChatRoom> userChatRooms = userChatRoomRepository.findByChatRoom_Id(chatRoomId);

        // 어떤 채팅방에 쌓인 알림인지 알기 위한 Find
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);



        // 접속 중인 유저 목록 가져오기 (없으면 빈 Set)
        // 채팅방 ID를 기준으로 Map에서 유저 목록을 가져온다
        Set<String> activeUsers = RealTimeUserManagement.activeUsersByRoom.getOrDefault(chatRoomId, Set.of());

        for (UserChatRoom ucr : userChatRooms) {
            User user = ucr.getUser();
            String userId = user.getUserId();

            // 현재 채팅방에 접속 중인 유저는 저장 제외
            if (activeUsers.contains(userId)) {
                continue;
            }

            ChatIsRead chatIsRead = new ChatIsRead();
            chatIsRead.setChatRoomId(chatRoom.get());
            chatIsRead.setUser(user);
            chatIsRead.setContent(chatContent);

            chatIsReadRepository.save(chatIsRead);
        }
        return true;
    }


    public int countUnReadChat(Map<String, String> request){

        String userId = request.get("userId");
        String chatRoomId = request.get("chatRoom");

        Optional<User> user = userRepository.findByUserId(userId);
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);

        // 유저와 방 ID로 검색하여 안읽은 채팅의 개수를 구함
        int noReadChatCount = chatIsReadRepository.findByUserAndChatRoomId(user.get(), chatRoom.get()).size();

        return noReadChatCount;
    }

    public void setRead(Map<String, String> request){

        // Map에서 데이터 가져오기
        String userId = request.get("userId");
        String chatRoomId = request.get("chatRoom");

        // 유저와 채팅방 엔티티를 찾음
        Optional<User> user = userRepository.findByUserId(userId);
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);

        // 유저와 채팅방에 해당하는 컬럼 리스트를 찾음
        List<ChatIsRead> chatIsReads = chatIsReadRepository.findByUserAndChatRoomId(user.get(), chatRoom.get());

        // 읽음 처리는 안읽은 채팅 리스트는 DB에서 삭제한다.
        chatIsReadRepository.deleteAll(chatIsReads);
    }
}
