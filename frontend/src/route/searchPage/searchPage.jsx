import { useState, useEffect, useContext } from 'react'
import { Routes, Route, Link, useNavigate} from 'react-router-dom'
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './searchPage.css'

// 로그인 체크용 Comtext API import
import { LogContext } from '../../App.jsx'


function SearchPage() {
  // navigate 객체 생성
  const navigate = useNavigate();

  // State 보관함 해체
  const {isLogIn, setIsLogIn, userData} = useContext(LogContext)
  
  // 로그인 여부 검사 Effect
  // 로그아웃 상태로 '/' 접근시 '/login'으로 navigate
  useEffect(()=>{
    if(!isLogIn) {
      navigate('/login');
    } 
  },[isLogIn])


  const [name, setName] = useState('');
  const [rooms, setRooms] = useState([]);

   // 처음 url에 입장할때 목록 가져오기 실행
  useEffect(() => {
    axios.get('/api/chat/rooms')
      .then((res) => {
        setRooms(res.data);   // rooms에 채팅방
      })
      .catch((err) => console.error('방 목록 가져오기 실패', err));
  }, []);

  // 채팅방 생성 API
  function createRoom() {
    axios.post('/api/chat/rooms', null, {
      params: { name }, // 채팅방 이름 전송
    })
    .then((res) => {
      setName('');     
    })
    .catch((err) => console.error('방 생성 실패', err));
  }

  // 유저의 채팅방 저장 API
  function saveUserChatRoom(roomId){
    axios.post('/api/add/user/chatroom', {
      userId: userData.userId,
      roomId: roomId
    })
    .then((res) => {
        console.log("성공")
    })
    .catch((err) => console.error('저장 실패', err));
  }

 

  return (
    <div className='fullscreen' style={{display:"flex", padding:"10px"}}>

      {/* 좌측 사이드바 */}
      <div className='contentStyle leftSize'>
        여긴 카테고리
        <p>ID : {userData.userId}</p>
        <p>Name : {userData.userName}</p>       
        <p>Email : {userData.userEmail}</p>
      </div>

      {/* 우측 사이드바 */}
      <div className='rightSize'>

        {/* 검색 바 */}
        <div className='contentStyle searchBarSize'>
          검색창임
        </div>


        {/* 채팅방 리스트 */}
        <div className='contentStyle chatListSize'>

          {/* 채팅방 리스트 */}
          <div>
            채팅 리스트
            {
              rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => { saveUserChatRoom(room.id); }} // 채팅방 선택
                  style={{color:"white", border:"1px solid", margin: "10px", height:"50px"}}>
                  
                  <div>{room.name} {room.id}</div>
                </div>
              ))
            }
          </div>
          
          {/* 채팅방 생성 */}
          <div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
            <button onClick={createRoom}>방 만들기</button>
          </div>

        </div>
          

        {/* 하단 광고 및 알림바*/}
        <div className='bottomSize' style={{display:"flex"}}>

          {/* 광고바 */}
          <div className='contentStyle searchAdSize'>
            광고든 뭐든 그거
          </div>

          {/* 로비페이지 버튼*/}
          <Link to="/">
            <div className='contentStyle noticeSize'>
              <img src="/MessageIcon.png" className='imgPos'></img>
            </div>
          </Link>
        </div>    
      </div>

    </div>
  )
}

export default SearchPage
