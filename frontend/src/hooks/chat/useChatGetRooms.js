import { useState, useEffect } from 'react'
import axios from 'axios';

/* ======================================================================
이 커스텀 훅은 유저가 lobby 컴포넌트의 chatListPage 컴포넌트일시 해당 유저가 저장한 
채팅방을 불러오는 로직이다.

- function useChatGetRooms() : 현재 유저가 구독(저장)한 채팅방 목록을 불러오는 커스텀훅훅
====================================================================== */ 

export function useChatGetRooms(userData, setChatList){

    // 처음 url에 입장할때 목록 가져오기 실행
    useEffect(() => {
      // 초기 userData 정의 안되어있을시 return
      if (!userData?.userId) { return }; 

      axios.get('/api/get/user/chatrooms', {
        // Context에 저장된 userId로 get 요청
        params: { 
          userId: userData.userId   // 유저 ID
        }
      })
      .then((res) => {

        // ChatList State에 유저가 저장한 방 목록 Set
        setChatList(res.data);
      })
      .catch((err) => console.error('chatList가져오기 실패', err));
  }, [userData, setChatList]);
}