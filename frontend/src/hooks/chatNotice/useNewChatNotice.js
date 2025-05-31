import { useEffect } from 'react'
import { Client } from '@stomp/stompjs';



export function useNewChatNotice(userData, selectedRoom, setUnreadCounts){

    
      // 유저가 포함된 채팅방에서 채팅 기록이 업로드가 되었을시 실행
      useEffect(() => {
        if (!userData || !userData.userId) return;
    
        const stomp = new Client({
          brokerURL: 'ws://localhost:8080/gs-guide-websocket',
          reconnectDelay: 5000,
          
          // STOMP 연결 API
          onConnect: () => {
            stomp.subscribe(`/topic/chat/summary/${ userData.userId }`, msg => {
    
              // 해당 구독 링크로 들어온 데이터는 chatRoomId (채팅방 ID)와 lastMessage(마지막 채팅) 이다.
              const { chatRoomId, lastMessage } = JSON.parse(msg.body);
       
              // 현 채팅방을 구독하고있을시 카운트를 증가시키지 않는다다
              if(selectedRoom?.id != chatRoomId) {
    
                // 안읽음 메세지 State Set
                setUnreadCounts(prev => ({
                  ...prev, [chatRoomId] : (prev[chatRoomId] || 0) + 1 
                }));
                //updateUnReadChatCount(chatRoomId);
              }
            });
          },
        });
        
        // stomp 활성화
        stomp.activate();
    
        return () => {
          stomp.deactivate();
        };
      }, [userData, selectedRoom]);
}