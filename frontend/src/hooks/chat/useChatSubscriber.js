// hooks/useChatSubscriber.js
import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';

export function useChatSubscriber(selectedRoom, setMessages, setClient) {
  useEffect(() => {
    if (!selectedRoom) return;

    const stomp = new Client({
      brokerURL: 'ws://localhost:8080/gs-guide-websocket',
      reconnectDelay: 5000,
      
      // STOMP 연결 API
      onConnect: () => {
        // 방 선택시 콘솔 출력
        if(selectedRoom){
          console.log(`${selectedRoom.id} STOMP 연결 성공`);
        }

        stomp.subscribe(`/topic/chat/${selectedRoom.id}`, msg => {
          // Message State Set
          setMessages(prev => [...prev, JSON.parse(msg.body)]);
        });
      },
    });

    stomp.activate();
    setClient(stomp);

    return () => {
      stomp.deactivate();
    };
  }, [selectedRoom, setMessages, setClient]);
}