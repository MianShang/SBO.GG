package com.example.backend.Service;

import com.example.backend.Dto.Request.UserChatRoomRequestDto;
import com.example.backend.Dto.Response.UserResponseDto;
import com.example.backend.Entity.ChatRoom;
import com.example.backend.Entity.User;
import com.example.backend.Entity.UserChatRoom;
import com.example.backend.Repository.ChatRoomRepository;
import com.example.backend.Repository.UserChatRoomRepository;
import com.example.backend.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserChatRoomService {

    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserChatRoomRepository userChatRoomRepository;


    // 유저가 검색 페이지에서 채팅방 저장시 사용되는 서비스
    public void saveUserChatRoom(UserChatRoomRequestDto userChatRoomDto){

        User user = userRepository.findByUserId(userChatRoomDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatRoom room = chatRoomRepository.findById(userChatRoomDto.getRoomId())
                .orElseThrow(() -> new RuntimeException("ChatRoom not found"));

        boolean exists = userChatRoomRepository.findByUserAndChatRoom(user, room).isPresent();
        if (exists) return;

        UserChatRoom userChatRoom = new UserChatRoom();
        userChatRoom.setUser(user);
        userChatRoom.setChatRoom(room);

        userChatRoomRepository.save(userChatRoom);
    }


    // 유저가 저장한 채팅방을 불러오는 Service
    public List<UserChatRoom> getUserChatRooms(String userId) {

        List<UserChatRoom> userChatRooms = userChatRoomRepository.findByUser_UserId(userId);

        return userChatRooms;
    }


    // 채팅방에 포함된 유저 목록 가져오는 Service
    public List<UserResponseDto> getChatRoomUsers(String roomId) {
        // RoomId를 통해 UserChatRoom 컬럼 select
        List<UserChatRoom> userChatRooms = userChatRoomRepository.findByChatRoom_Id(roomId);

        // UserDto 리스트 선언
        List<UserResponseDto> userDtos = new ArrayList<>();

        // List<UserChatRoom> userChatRooms의 유저 데이터만 UserDto로 return
        for (UserChatRoom ucr : userChatRooms) {
            User user = ucr.getUser();

            // UserDto 선언
            UserResponseDto dto = new UserResponseDto();

            // UserDto Set
            dto.setUserId(user.getUserId());
            dto.setUserName(user.getUserName());
            dto.setUserEmail(user.getUserEmail());
            dto.setUserProfile(user.getUserProfile());

            // List Add
            userDtos.add(dto);
        }
        return userDtos;
    }

}
