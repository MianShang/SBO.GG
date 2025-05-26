import axios from 'axios';

export function useChatListGet(setMessages){
    
  // 해당 채팅방에 저장된 메세지 불러오는 함수
  function getChatList(roomId){
     axios.get('/api/user/request/userchatlist', {
      // Context에 저장된 roomId로 get 요청
      params: { 
        roomId: roomId
      }
    })
    .then((res) => {
        // 메세지 State set
        setMessages(res.data)
    })
    .catch((err) => console.error('채팅 내역 불러오기 실패', err));
  }

  return getChatList;
}