import { useEffect } from 'react'
import axios from 'axios';

export function useUnReadChatCount(userData, chatList, setUnreadCounts){
    
  // chatList State가 지정될시 서버로부터 채팅방별 안읽은 메세지 개수를 가져온다
  useEffect(() => {

    if(!userData){ return; }

    chatList.forEach(item => {

      // 채팅방 안읽은 메세지 개수 가져오는 함수
      countUnReadChat(item.chatRoom);
    });

  }, [userData, chatList]);


  // 채팅방별 안읽은 메세지 Set
  function countUnReadChat(chatRoom){

    if(!chatRoom){ return; }

    axios.get('/api/get/chat/no-read', {
      params: {
        userId: userData.userId,
        chatRoom: chatRoom.id
      }
    })
    // 해당 API에서 반환되는 데이터는 채팅방별 안읽은 메세지의 개수이다
    .then((res) => {      
      // 채팅방 안읽은 메세지 개수 State Set 
      setUnreadCounts(prev => ({ ...prev, [chatRoom.id]: res.data }));
    })
    .catch((err) => console.error('채팅방 안읽은 메세지 목록 가져오기 실패', err));
  }

}