// hooks/useChatSubscriber.js
import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';

/* ======================================================================
이 커스텀 훅은 유저가 채팅방을 구독하는 로직이다다

- function useChatSubscriber() : 채팅방 서버 구독과 들어오는 메세지 State를 Set하는 함수수 
====================================================================== */ 

export function useChatSubscriber(selectedRoom, setMessages, setClient) {
  
  useEffect(() => {
    if (!selectedRoom) return;

    const stomp = new Client({
      brokerURL: 'ws://localhost:8080/gs-guide-websocket',
      reconnectDelay: 5000,
      
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
      stomp.deactivate();
    };
  }, [selectedRoom, setMessages, setClient]);
}