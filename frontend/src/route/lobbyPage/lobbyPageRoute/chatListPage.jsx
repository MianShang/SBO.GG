import { useState, useEffect, useContext } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './list.css'


// 전역 유저 State 데이터 가져오기용 Comtext API import
import { LogContext } from '../../../App.jsx'

function chatListPage({setSelectedRoom}) {

  // State 보관함 해체
  const {isLogIn, setIsLogIn, userData} = useContext(LogContext)

  // State 선언언
  const [chatList, setChatList] = useState([]);
  const [chatListExtend, setChatListExtend] = useState(false);


  // 처음 url에 입장할때 목록 가져오기 실행
  useEffect(() => {
      axios.get('/api/get/user/chatrooms', {
        // Context에 저장된 userId로 get 요청
        params: { 
          userId: userData.userId
        }
      })
      .then((res) => {
        // ChatList State에 유저가 저장한 방 목록 Set
        setChatList(res.data);
      })
      .catch((err) => console.error('chatList가져오기 실패', err));
  }, [userData]);



  return (
    <div className='listRouteSize contentStyle' style={{color:"white"}}>
       {
        chatList.map((item, i) => (
        <div key={item.id}  className={`${chatListExtend ? 'chatListStyleExtend' : 'chatListStyle'}`}
          onClick={()=>{ setSelectedRoom(item.chatRoom.id); }}>
          <p>{item.chatRoom.name}</p>
     
          <p onClick={()=>{setChatListExtend(!chatListExtend)}} >[더보기]</p>
         
        </div>
      ))}
    </div>
  )
}

export default chatListPage
