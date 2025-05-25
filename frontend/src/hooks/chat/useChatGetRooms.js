import { useState, useEffect } from 'react'
import axios from 'axios';

export function useChatGetRooms(userData, setChatList){

    // 처음 url에 입장할때 목록 가져오기 실행
    useEffect(() => {
      // 초기 userData 정의 안되어있을시 return
      if (!userData?.userId) { return }; 

      axios.get('/api/get/user/chatrooms', {
        // Context에 저장된 userId로 get 요청
        params: { 
          userId: userData.userId
        }
      })
      .then((res) => {
        // ChatList State에 유저가 저장한 방 목록 Set
        setChatList(res.data);
      })
      .catch((err) => console.error('chatList가져오기 실패', err));
  }, [userData, setChatList]);
}