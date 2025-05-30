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


  // chatList State가 지정될시 서버로부터 채팅방별 안읽은 메세지 개수를 가져온다
  useEffect(() => {
    chatList.forEach(item => {

      // 채팅방 안읽은 메세지 개수 가져오는 함수
      countUnReadChat(item.chatRoom);
    });

  }, [chatList]);


  // 채팅방별 안읽은 메세지 Set
  function countUnReadChat(chatRoom){

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


  // 채팅방 속성 중 게임 이름에 따른 아이콘 세팅 함수
  function setGameIcon(gameName){
    switch(gameName)
    {
      case "overwatch" :
        return "/gameIcons/overwatch_Icon.png";

      case "lol" :
        return "/gameIcons/lol_Icon.png";

      case "valorant" :
        return "/gameIcons/valorant_Icon.png";

      case "maplestory" :
        return "/gameIcons/maplestory_Icon.png";

      default:
        return "https://placehold.co/45";
    }
  }


  return (
    <div className='listRouteSize contentStyle'>

      {/* 실시간 참여중인 채팅방 상단 표시 */}
      { selectedRoom ?

        <div className='selectCardStyle'>

          <div className='selectCardHeaderStyle'>

            <img src={`${setGameIcon(selectedRoom.gameName)}`} alt="방 아이콘" className="chatCardImage" />
            {/* 실시간 참여중인 채팅방 이름 표시 */}
            <p>{ selectedRoom ? selectedRoom.name : null }</p>
            <p></p>
          </div>  
         
          {/* 더보기 클릭시 채팅방 구독한 유저 리스트 표시 */}
          { chatListExtend  ?
            <div className='selectCardUserListStyle'>
          
              {/* 유저가 구독한 채팅방 리스트 출력 */}  
              { chatUserList.map((item, i) => (

                <div key = { item.userId } className='UserListContentStyle'>
                  <p>{ item.userId }</p>

                  <div className="MoreButtonStyle">…</div>
                  
                </div>
              )) }
            </div> 
          : null }

            {/* 하단 버튼 */}
            <div onClick={()=>{ 
              setChatListExtend(!chatListExtend);   // 확장 여부 State 반전
              getChatUserList(selectedRoom.id);     // 해당 채팅방의 유저 목록을 가져오는 커스텀 훅훅
            }}>
            { !chatListExtend ? <p>▼</p> : <p>▲</p> }
          </div>
        </div>
      : null}

      
     <div className="chatListScrollWrapper chatListScroll">

        {/* 유저가 저장한 채팅방 리스트 출력 */}
        { chatList.map((item, i) => {
          
          // 채팅방별 안읽은 메세지 개수 
          const unread = unreadCounts[item.chatRoom.id] || 0;
          
          return (
            <div key={item.id} className="chatCard"

            onClick={() => { 
              setChatListExtend(false);
              setSelectedRoom(item.chatRoom);
              getChatList(item.chatRoom.id, setMessages);
              setRead(item.chatRoom);
              unreadCounts[item.chatRoom.id] = 0;
            }}>

              <div className="chatCardHeader">
                {/* 게임 아이콘 */}
                <img src={`${setGameIcon(item.chatRoom.gameName)}`} alt="방 아이콘" className="chatCardImage" />

                {/* 채팅방 이름 */}
                <span className="chatCardTitle">{ item.chatRoom.name } </span>
                {/* 채팅방 삭제 */}
                <span  className="chatCardDelete"
                  onClick={(e) => { e.stopPropagation(); deleteUserRoom(item.id); }}>
                  🗑
                </span>
              </div>

            {/* 안읽은 메세지 개수를 출력한다.*/}
            { unread > 0 ?
              <div className="chatCardFooter">
                <span className="chatCardBadge">{ unread }</span>
                <span className="chatCardLastMessage">안읽은 메세지가 있습니다</span>
              </div>
              : null }
          </div>)
        })}
      </div>
    </div>
  )
}

export default ChatListPage
