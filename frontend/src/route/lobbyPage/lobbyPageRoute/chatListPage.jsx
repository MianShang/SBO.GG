import { useState, useEffect, useContext } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './list.css'


// 전역 유저 State 데이터 가져오기용 Comtext API import
import { LogContext } from '../../../App.jsx'

// Custom Hook import
import { useChatGetRooms } from '../../../hooks/chat/useChatGetRooms.js'

function chatListPage({setSelectedRoom}) {

  // State 보관함 해체
  const {isLogIn, setIsLogIn, userData} = useContext(LogContext)

  // State 선언
  const [chatList, setChatList] = useState([]);                 // 해당당
  const [chatListExtend, setChatListExtend] = useState(false);

  useChatGetRooms(userData, setChatList);
 
  return (
    <div className='listRouteSize contentStyle' style={{color:"white"}}>
       {
        chatList.map((item, i) => (
        <div key={item.id}  className={`${chatListExtend ? 'chatListStyleExtend' : 'chatListStyle'}`}
          onClick={()=>{ setSelectedRoom(item.chatRoom.id); }}>
          <p>{item.chatRoom.name}</p>
     
          <p onClick={()=>{setChatListExtend(!chatListExtend)}}>[더보기]</p>
         
        </div>
      ))}
    </div>
  )
}

export default chatListPage
