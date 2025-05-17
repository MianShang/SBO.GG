import { useState, useEffect, useContext } from 'react'
import { Routes, Route, Link, useNavigate  } from 'react-router-dom'
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './lobbyPage.css'

// 컴포넌트 import
import ChatListPage from './lobbyPageRoute/chatListPage.jsx';
import FriendListPage from './lobbyPageRoute/friendListPage.jsx';

// 로그인 체크용 Comtext API import
import { LogContext } from '../../App.jsx'


function LobbyPage() {
  // navigate 객체 생성
  const navigate = useNavigate();

  // 사이드바 프로필 이미지 클릭시 중앙 div는 사라지게 - 기본값 true(중앙 div 표시)
  const [showMidBar, setShowMidBar] = useState(true);

  // toggle State를 기준으로 채팅 / 친구 컴포넌트 교체 - 기본값 true (채팅)
  const [toggle, setToggle] = useState(true);

  // State 보관함 해체
  const {isLogIn, setIsLogIn, userData} = useContext(LogContext)

  // 로그인 여부 검사 Effect
  // 로그아웃시 isLogIn State의 변화에 의해 실행
  // 로그아웃 상태로 '/' 접근시 '/login'으로 navigate
  useEffect(()=>{
    if(!isLogIn) {
      navigate('/login')
    }
  },[isLogIn])

  // 로그아웃 처리 API
  function logoutFunc() {
    axios.post('/api/logout')
    .then((res) =>{
      console.log(res)
      
      // 로그아웃시 로그인 여부 Context State FALSE
      setIsLogIn(false);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  // ======================================================================
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  
  // 채팅방 연결
  // selectedRoom이 변경될 때마다 실행
  useEffect(() => {
    if (!selectedRoom) return;

    setMessages([]); // 방 변경 시 기존 메시지 초기화

    const stomp = new Client({
      brokerURL: `ws://localhost:8080/gs-guide-websocket`,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('STOMP 연결 성공');
        stomp.subscribe(`/topic/chat/${selectedRoom.id}`, (msg) => {
          console.log('받은 메시지 body:', msg.body);
          // 메시지를 새로운 메시지로 업데이트
          setMessages((prev) => [...prev, JSON.parse(msg.body)]);
        });
      },
    });

    stomp.activate();
    setClient(stomp);

    return () => {
      stomp.deactivate(); // 컴포넌트 unmount 시 STOMP 연결 해제
    };
  }, [selectedRoom]); 


  // 메시지 전송
  const sendMessage = () => {
    if (client && input.trim()) {
      client.publish({
        destination: `/app/chat/${selectedRoom.id}`,
        body: JSON.stringify({ name: `${userData.userName}`, message: input }), // 메시지 전송
      });
    setInput(''); // 메시지 전송 후 input 초기화
    }
  }

  // ======================================================================
  
  return (
    <div className='fullscreen' style={{display:"flex", padding:"10px"}}>
     
      {/* 좌측 사이드바 */}
      {/* 좌측 사이드바는 showMidBar State를 기준으로 동적 조절*/}
      <div className={`contentStyle ${showMidBar ? 'sideBarSize':'sideBarExpanded'}`}>
        
        {/* 이미지(프로필) 클릭시 사이드바 확장으로 정보 수정 setShowMidBar(false) */}
        {/* showMidBar 값에 따라 다른 css 적용*/}
        <img src="https://placehold.co/375x375" onClick={() =>{ setShowMidBar(false);}}
         className={`${showMidBar ? 'sideBarImgSize' : 'sideBarImgSizeExpanded'}`} />

         
         {/* showMidBar false일시 정보 수정창 표시 */}
         { showMidBar ? 
            <div>
              <p onClick={()=>{ logoutFunc() }}>로그아웃</p>
            </div> 
            : <>
              {/* 정보 수정 */}
              <div className='sideBarDetailSize'>
                정보수정
                <p>ID : {userData.userId}</p>
                <p>Name : {userData.userName}</p>
                <p>Email : {userData.userEmail}</p>
              </div>

              {/* 완료 버튼 */}
              {/* 클릭시 setShowMidBar true*/}
              <div className='sideBarButtonBox'>
                <div className='sideBarButton' onClick={() =>{ setShowMidBar(true); }}>
                  완료
                </div>
              </div> 
            </>
          }
      </div>
  
      {/* 중간 친구/채팅 바 */}
      {
        /* showMidBar State가 true시에만 표시 되는 div 영역 */
        showMidBar ? (
          <div className='midBarSize'>

            {/* 토글 버튼 */}
            <div style={{ display: "flex" }}>
              {/* 채팅 토글 */}
              <div onClick={() => setToggle(true)}
                className={`toggleSwitchText contentStyle toggleSwitch ${toggle ? 'activeBorder' : ''}`} >
                채팅
              </div>

              {/* 친구 토글 */}
              <div onClick={() => setToggle(false)}
                className={`toggleSwitchText contentStyle toggleSwitch ${!toggle ? 'activeBorder' : ''}`}
                style={{ marginLeft: "10px" }} >
                친구
              </div>
            </div>

            {/* 토글 버튼 하단의 각 리스트 div*/}
            <div className='listSize'>
              {      
                toggle ? 
                <ChatListPage setSelectedRoom = { setSelectedRoom } /> : <FriendListPage />
              }
            </div>
          </div>
        ) : null
      }


      {/* 우측 채팅방 */}
      <div className='rightBarSize'>

        {/* 상단 채팅창 */}
        <div className='contentStyle chatSize' style={{textAlign:"left"}}>
          채팅창임

          {/* 메시지 목록 출력 */}
          <div style={{color:"white"}}>
            {messages.map((msg, i) => (
              <div key={i}>
                <strong>{msg.name}</strong>: {msg.message}
              </div>
            ))}
          </div>

          <div className="inputLocation inputSize">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)} // 입력값 업데이트
              placeholder="메시지를 입력하세요"
              className=""/>
            <button onClick={sendMessage}>보내기</button> {/* 메시지 전송 */}
        </div>

        </div>

        {/* 하단 돋보기 검색바 */}
        <div style={{display:"flex"}}>
          {/* 광고 라인 */}
          <div  className='contentStyle adSize'>
            광고든 뭐든 암튼 뭐든 채울거
          </div>

          {/* 검색 페이지 */}
          <Link to="/search">
            <div className='contentStyle searchSize'>
              <img src="/SearchIcon.png" className='imgPos'></img>
            </div>
          </Link>
          
        </div>
      </div>

    </div>
  )
}

export default LobbyPage
