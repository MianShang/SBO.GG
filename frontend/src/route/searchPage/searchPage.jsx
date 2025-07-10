import { useState, useEffect, useContext } from 'react'
import { Routes, Route, Link, useNavigate} from 'react-router-dom'
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './searchPage.css'

// 로그인 체크용 Context API import
import { LogContext } from '../../App.jsx'

// custom hook import
import { useLoginCheck }      from '../../hooks/login/useLoginCheck.js';


function SearchPage() {

  const [name, setName]  = useState('');
  const [rooms, setRooms] = useState([]);
  const [gameName, setGameName] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // State 보관함 해체
  const {isLogIn, setIsLogIn, userData} = useContext(LogContext)
  
  // 커스텀 훅 가져오기
  useLoginCheck(isLogIn);   // 로그인 체크 훅

  
  // 처음 url에 입장할때 목록 가져오기 실행 및 채팅방 검색
  useEffect(() => {
  axios.get('/api/chat/rooms', {
      params: { keyword: searchKeyword }
    }).then((res) => setRooms(res.data));
  }, [searchKeyword]);

  // 채팅방 생성 API
  function createRoom() {
    axios.post('/api/chat/rooms',  {
      chatName  : name ,
      gameName: gameName // 채팅방 이름 전송
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
          <input
            type="text"
            placeholder="방 이름 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="searchInput"
          />
        </div>


        {/* 채팅방 리스트 */}
        <div className='contentStyle chatListSize'>

          {/* 채팅방 리스트 */}
          <div className='chatListScroll'>
            {
              rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => { saveUserChatRoom(room.id); }} // 채팅방 선택
                  style={{color:"white", border:"1px solid", margin: "10px", height:"50px"}}>
                  
                  <div>{room.name}</div>
                </div>
              ))
            }
          </div>
          
          {/* 채팅방 생성 영역 */}
          <div className='chatCreate'>
            <select value={gameName} onChange={(e) => setGameName(e.target.value)}>
              <option value="" disabled selected>--선택해주세요--</option>
              <option value="overwatch">오버워치</option>
              <option value="lol">롤</option>
              <option value="maplestory">메이플스토리</option>
              <option value="lostark">로스트아크</option>
            </select>

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
