import axios from 'axios';

/* ======================================================================
이 커스텀 훅은 유저가 채팅방으로 메세지를 전송하고 DB에 저장하는는 로직이다.

- function sendMessage() : 현재 구독중인 채팅방으로 메세지를 발행하는 로직
- axios.post('/api/user/add/userchatlist', {...}) : 서버로 데이터를 보내 저장하는 로직
====================================================================== */ 

export function useChatSender(client, selectedRoom, userData, input, setInput) {
  
  function sendMessage() {
    // 채팅방 서버와 input이 입력되어 있을때만 동작
    if (client && input.trim()) {
      // 메세지 발행 로직
      client.publish({
        
        destination: `/app/chat/${selectedRoom.id}`,

        body: JSON.stringify({ 
          name: userData.userId, 
          message: input 
        }),
      });

      

      // 채팅 내역 저장 API
      axios.post('/api/user/add/userchatlist', {
        chatRoom : selectedRoom.id,   // 해당 채팅방 ID
        chatContent : input,          // 입력 내용
        userId : userData.userId      // 유저 ID
      })
      .then((res) => {
        console.log('메세지 저장 성공');
      })
      .catch((err) => {
        console.error('메세지 저장 실패:', err);
      });


      // 안읽은 메세지 처리를 위해 
      axios.post('/api/chat/isread', {
        chatRoom : selectedRoom.id,   // 해당 채팅방 ID
        chatContent : input            // 입력 내용
      })
      .then((res) => {
        console.log('메세지 저장 성공2');
      })
      .catch((err) => {
        console.error('메세지 저장 실패2', err);
      });

      // 입력창 비우기기
      setInput('');

    }
    
  }

  return sendMessage;
}