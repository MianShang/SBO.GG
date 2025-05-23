import { useState, useEffect, useContext } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './list.css'


// 전역 유저 State 데이터 가져오기용 Comtext API import
import { LogContext } from '../../../App.jsx'

// Custom Hook import
import { useChatGetRooms } from '../../../hooks/chat/useChatGetRooms.js'

function ChatListPage({ selectedRoom, setSelectedRoom }) {

  // State 보관함 해체
  const {userData} = useContext(LogContext)

  // State 선언
  const [chatList, setChatList] = useState([]);                   // 채팅 리스트 State        
  const [chatUserList, setChatUserList] = useState([]);           // 채팅리스트 확장시 유저를 담을 State
  const [chatListExtend, setChatListExtend] = useState(false);    // 채팅 리스트 확장 css 여부 State


  // 로그인한 유저의 채팅방 가져오는 커스텀 훅
  useChatGetRooms(userData, setChatList);

  // 채팅방의 유저 목록을 가져오는 함수수
  function getChatUserList(roomId){

    axios.get('api/get/user/chatlist', {
      // Context에 저장된 userId로 get 요청
      params: { 
        roomId: roomId
      }
    })
    .then((res) => {
      setChatUserList(res.data);
    })
    .catch((err) => console.error('방 아이디 보내기 실패', err));
  }


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

  useEffect(()=>{
    console.log(selectedRoom)
  },[selectedRoom])

  return (
    <div className='listRouteSize contentStyle' style={{color:"white"}}>

      {/* 실시간 참여중인 채팅방 상단 표시 */}
      { selectedRoom ?
        <div style={{border:"1px solid white", borderRadius:"7px", width:"100%", marginBottom:"30px",backgroundColor:"gray"}}>
          
          {/* 실시간 참여중인 채팅방 이름 표시 */}
          <p>{ selectedRoom ? selectedRoom.name : null }</p>
          
          {/* 더보기 클릭시 채팅방 구독한 유저 리스트 표시 */}
          { chatListExtend  ?
            <div style={{border:"1px solid white",height:"200px", overflowY: "auto" }}>
          
              {/* 유저가 구독한 채팅방 리스트 출력 */}  
              { chatUserList.map((item, i) => (
                <div key={ item.userId }>
                  <p>{ item.userId } - { item.userName }</p>
                </div>
              ))}
            </div> 
            : null }

          {/* 하단 버튼 */}
          <div onClick={()=>{ setChatListExtend(!chatListExtend); getChatUserList(selectedRoom.id); }}>
              { !chatListExtend ? <p>[더보기]</p> : <p>[닫기]</p> }
          </div>
        </div>
      : null}
     
      
       
      {/* 유저가 저장한 채팅방 리스트 출력 */}
      { chatList.map((item, i) => (
        <div key={item.id} className={'chatListStyle'} >
            
          {/* 스타일 임시로 지정 */}
          <div style={{display:"flex", textAlign:"center"}}>
            {/* 선택시 방 ID를 방 구독 커스텀훅으로 전달 */}
            <p onClick={()=>{ setSelectedRoom(item.chatRoom); }}> {item.chatRoom.name} </p>
            
            {/* [삭제] 클릭시 유저 저장 채팅방 테이블의 기본키를 전송하여 요청 */}
            <p onClick={()=>{ deleteUserRoom(item.id); }}>--[삭제]</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatListPage
