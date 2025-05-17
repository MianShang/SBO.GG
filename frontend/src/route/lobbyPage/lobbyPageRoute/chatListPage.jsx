import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';
import './list.css'

function chatListPage({ setSelectedRoom }) {

  const [rooms, setRooms] = useState([]);

  // 처음 url에 입장할때 목록 가져오기 실행
  useEffect(() => {
    axios.get('http://localhost:8080/api/chat/rooms')
      .then((res) => {
        setRooms(res.data);   // rooms에 채팅방
      })
      .catch((err) => console.error('방 목록 가져오기 실패', err));
  }, []);

  return (
    <div className='listRouteSize contentStyle'>
        채팅 리스트
        {
          rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)} // 채팅방 선택
              style={{color:"white"}}>
                <hr/>
              <div>{room.name} {room.id}</div>
            </div>
          ))
        }
    </div>
  )
}

export default chatListPage
