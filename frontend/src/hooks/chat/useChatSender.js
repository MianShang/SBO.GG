import axios from 'axios';

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

      // 입력창 비우기기
      setInput('');

      // 채팅 내역 저장 API
      axios.post('/api/user/add/userchatlist', {
        chatRoom : selectedRoom.id,   
        chatContent : input,
        userId : userData.userId
      })
      .then((res) => {
        console.log('메세지 저장 성공');
      })
      .catch((err) => {
        console.error('메세지 저장 실패:', err);
      });
    }
    
  }

  return sendMessage;
}