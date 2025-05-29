import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import './list.css'

// 전역 유저 State 데이터 가져오기용 Comtext API import
import { LogContext } from '../../../App.jsx'

// Custom Hook import
import { useChatGetUserList } from '../../../hooks/chat/useChatGetUserList.js'
import { useChatDeleteRoom }  from '../../../hooks/chat/useChatDeleteRoom.js'
import { useChatGetRooms }    from '../../../hooks/chat/useChatGetRooms.js'
import { useChatListGet }     from '../../../hooks/chatList/useChatListGet.js'


function ChatListPage({ selectedRoom, setSelectedRoom, setMessages }) {

  // State 보관함 해체
  const { userData } = useContext(LogContext);

  // State 선언
  const [chatListExtend, setChatListExtend] = useState(false);  // 채팅 리스트 확장 css 여부 State
  const [chatUserList, setChatUserList]     = useState([]);     // 채팅리스트 확장시 유저를 담을 State
  const [chatList, setChatList]             = useState([]);     // 저장한 채팅방 리스트 State 


  // 커스텀훅 가져오기
  // -- UseEffect
  useChatGetRooms(userData, setChatList);                       // 로그인한 유저의 채팅방 가져오는 커스텀훅

  // -- Function
  const getChatUserList = useChatGetUserList(setChatUserList);  // 선택한 채팅방의 유저 목록을 불러오는 커스텀훅
  const deleteUserRoom  = useChatDeleteRoom();                  // 저장한 채팅방 지우는 커스텀훅
  const getChatList     = useChatListGet();                     // 실시간으로 구독한 채팅방의 채팅 목록 가져오는 커스텀훅

  const [unreadCounts, setUnreadCounts] = useState({});


  // chatList State 지정시 채팅 목록들의 안읽은 메세지 개수를 Set
  useEffect(() => {
    chatList.forEach(item => {

      // 채팅방 안읽은 메세지 개수 가져오는 함수
      testGet(item.chatRoom);
    });

  }, [chatList]);


  // 채팅방별 안읽은 메세지 Set
  function testGet(chatRoom){

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


  
  // 유저가 포함된 채팅방에서 채팅 기록이 업로드가 되었을시 실행
  useEffect(() => {
    if (!userData || !userData.userId) return;

    const stomp = new Client({
      brokerURL: 'ws://localhost:8080/gs-guide-websocket',
      reconnectDelay: 5000,
      
      // STOMP 연결 API
      onConnect: () => {
        stomp.subscribe(`/topic/chat/summary/${ userData.userId }`, msg => {

          // 해당 구독 링크로 들어온 데이터에서 채팅방 아이디, 메세지 내용 분리
          const { chatRoomId, lastMessage } = JSON.parse(msg.body);
   
          // 현 채팅방을 구독하고있을시 카운트를 증가시키지 않는다다
          if(selectedRoom?.id != chatRoomId ){

            console.log(lastMessage)

            updateUnReadChatCount(chatRoomId);
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

  // 카운트 신호
  function updateUnReadChatCount(chatRoomId){

    // 안읽음 메세지 State Set
    setUnreadCounts(prev => ({
      ...prev, [chatRoomId] : (prev[chatRoomId] || 0) + 1 
    }));
  }


  return (
    <div className='listRouteSize contentStyle' style={{ color:"white" }}>

      {/* 실시간 참여중인 채팅방 상단 표시 */}
      { selectedRoom ?
        <div style={{ border:"1px solid white", borderRadius:"7px", width:"100%", marginBottom:"30px",backgroundColor:"gray" }}>
          
          {/* 실시간 참여중인 채팅방 이름 표시 */}
          <p>{ selectedRoom ? selectedRoom.name : null }</p>
          
          {/* 더보기 클릭시 채팅방 구독한 유저 리스트 표시 */}
          { chatListExtend  ?
            <div style={{border:"1px solid white", height:"200px", overflowY: "auto" }}>
          
              {/* 유저가 구독한 채팅방 리스트 출력 */}  
              { chatUserList.map((item, i) => (

                <div key = { item.userId }>
                  <p>{ item.userId } - { item.userName }</p>
                </div>
              )) }
            </div> 
            : null }

          {/* 하단 버튼 */}
          <div onClick={()=>{ 
            setChatListExtend(!chatListExtend);   // 확장 여부 State 반전
            getChatUserList(selectedRoom.id);     // 해당 채팅방의 유저 목록을 가져오는 커스텀 훅훅
          }}>

            { !chatListExtend ? <p>[더보기]</p> : <p>[닫기]</p> }
          </div>

        </div>
      : null}
     
      {/* 유저가 저장한 채팅방 리스트 출력 */}
      { chatList.map((item, i) => {
        
        // 채팅방별 안읽은 메세지 개수 
        const unread = unreadCounts[item.chatRoom.id] || 0;
        
        return (
          <div key={item.id} className={'chatListStyle'} 
            onClick={()=>{ 
              setSelectedRoom(item.chatRoom);               // 방 선택 커스텀 훅
              getChatList(item.chatRoom.id, setMessages);   // 채팅방의 채팅 리스트 가져오는 커스텀 훅 
              setRead(item.chatRoom);                       // 채팅 읽음 처리

              unreadCounts[item.chatRoom.id] = 0;           // 첫 실행시 전부 읽음처리처럼 보이기 위해 0으로
            }}>
              
            {/* 스타일 임시로 지정 */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p>{ item.chatRoom.name }</p>
                  <p onClick={() => { deleteUserRoom(item.id); }} style={{ marginLeft: "10px", cursor: "pointer" }}>--[삭제]</p>
                </div>

              {/* 아래로 내린 안읽은 메시지 개수 */}
              <p style={{ color: "red", marginTop: "0px" }}>{ unread }</p>
            </div>
            
            </div>
          </div>)
        })}
    </div>
  )
}

export default ChatListPage
