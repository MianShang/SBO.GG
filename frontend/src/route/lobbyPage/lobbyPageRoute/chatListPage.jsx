import { useState, useEffect, useContext } from 'react'
import axios from 'axios';
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
  const { userData } = useContext(LogContext)

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


  const [noRead, setNoRead] = useState([]);


  function testGet(chatRoom){
    axios.get('/api/get/chat/no-read',{
      params: {
        userId: userData.userId,
        chatRoom: chatRoom.id
      }
    })
    .then((res) => {
        // ChatList State에 유저가 저장한 방 목록 Set
        console.log(chatRoom.name)
        console.log('안읽은 메세지 개수 : ' + res.data)
      })
      .catch((err) => console.error('실패 ㅅㄱ', err));
  }


  return (
    <div className='listRouteSize contentStyle' style={{ color:"white" }}>

      {/* 실시간 참여중인 채팅방 상단 표시 */}
      { selectedRoom ?
        <div style={{border:"1px solid white", borderRadius:"7px", width:"100%", marginBottom:"30px",backgroundColor:"gray"}}>
          
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
          <div onClick={()=>{ setChatListExtend(!chatListExtend); getChatUserList(selectedRoom.id); }}>
              { !chatListExtend ? <p>[더보기]</p> : <p>[닫기]</p> }
          </div>

        </div>
      : null}
     
      {/* 유저가 저장한 채팅방 리스트 출력 */}
      { chatList.map((item, i) => {
        
        testGet(item.chatRoom);

        return (
          <div key={item.id} className={'chatListStyle'} onClick={()=>{ setSelectedRoom(item.chatRoom);  getChatList(item.chatRoom.id, setMessages); }}>
              
            {/* 스타일 임시로 지정 */}
            <div style={{display:"flex", textAlign:"center"}}>

              <p> { item.chatRoom.name} </p>
              
              {/* [삭제] 클릭시 유저 저장 채팅방 테이블의 기본키를 전송하여 요청 */}
              <p onClick={()=>{ deleteUserRoom(item.id); }}>--[삭제]</p>

            </div>
          </div> )
        })}
    </div>
  )
}

export default ChatListPage
