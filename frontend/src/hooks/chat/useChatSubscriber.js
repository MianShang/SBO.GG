// hooks/useChatSubscriber.js
import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';

/**
 * 채팅방을 구독하고, 실시간 메시지를 수신하는 커스텀 훅
 *
 * @param {Object} selectedRoom   - 현재 선택된 채팅방 객체
 * @param {State} setMessages  - 메시지 상태를 설정하는 State
 * @param {Function} setClient    - STOMP 클라이언트 인스턴스를 설정하는 함수
 * @param {string} userData       - 현재 접속한 유저의 데이터 이 함수에선 아이디(userId)를 요구한다.
 */
export function useChatSubscriber(selectedRoom, setMessages, setClient, userData) {
  
  useEffect(() => {
    if (!selectedRoom) return;

    const stomp = new Client({
      brokerURL: 'ws://localhost:8080/gs-guide-websocket',
      reconnectDelay: 5000,

      connectHeaders: {
        userId: userData.userId,
        roomId: selectedRoom.id
      },
      
      // STOMP 연결 API
      onConnect: () => {

        stomp.subscribe(`/topic/chat/${selectedRoom.id}`, msg => {
          // Message State Set
          setMessages(prev => [...prev, JSON.parse(msg.body)]);

        
        });
      },
    });

    // stomp 활성화
    stomp.activate();
    setClient(stomp);

    return () => {
      // 퇴장 시 서버에 알림 전송
      if (stomp.connected) {
        stomp.publish({
          destination: '/app/disconnect',
          body: JSON.stringify({
            userId: userData.userId,
            roomId: selectedRoom.id,
          }),
        });
      }

      stomp.deactivate();
    };
  }, [selectedRoom, setMessages, setClient]);
}