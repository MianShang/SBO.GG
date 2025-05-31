import axios from 'axios';


export function useSetReadUnReadChat(userData){
    
  // 채팅방 입장시 안읽은 메세지 읽음 처리
  function setRead(chatRoom){

    if(!chatRoom){ return; }

    // 안읽은 메세지 처리를 위해 
      axios.post('/api/chat/read', {
        userId : userData.userId,   // 입력 내용
        chatRoom : chatRoom.id      // 해당 채팅방 ID
      })
      .then((res) => {
        console.log('메세지 읽기 성공');
      })
      .catch((err) => {
        console.error('메세지 읽기 실패 ㅅㄱ', err);
      });
  }
     

  return setRead;
}