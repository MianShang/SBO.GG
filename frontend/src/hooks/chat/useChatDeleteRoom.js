import axios from 'axios';

/* ======================================================================
이 커스텀훅은 채팅방을 삭제하는 로직이다다

- deleteUserRoom():  유저가 저장한 채팅방을 삭제하는 로직직
====================================================================== */ 

export function useChatDeleteRoom(){
    
  // 자기가 구독한 방 삭제하는 함수
  function deleteUserRoom(userRoomTablePri){

    // 삭제 API 요청
    axios.post('/api/user/delete/userchatroom', {
      roomId: userRoomTablePri  // 해당 테이블의 기본키 전송 
    })
    .then((res) => {
      console.log('삭제 성공');
    })
    .catch((err) => {
      console.error('삭제 실패:', err);
    });
  }

  return deleteUserRoom;
}