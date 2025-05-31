import axios from 'axios';

/* ======================================================================
이 커스텀 훅은 유저가 채팅방 더보기를 선택시 해당 채팅방의 뮤저 목록을 보여주는 로직이다.

- function useChatGetUserList(): 채팅방의 유저 목록을 불러오는 로직 
====================================================================== */ 

export function useChatGetUserList(setChatUserList){

    // 채팅방의 유저 목록을 가져오는 함수
    function getChatUserList(roomId){

        axios.get('api/get/user/chatlist', {
            // Context에 저장된 roomId로 get 요청
            params: { 
                roomId: roomId
            }
        })
        .then((res) => {
            console.log(res.data)
            setChatUserList(res.data);
        })
    .catch((err) => console.error('방 아이디 보내기 실패', err));
  }
   return getChatUserList;
} 