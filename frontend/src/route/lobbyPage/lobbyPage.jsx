import { useRef,useState, useEffect, useContext, memo } from 'react'
import { Routes, Route, Link, useNavigate  } from 'react-router-dom'
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './lobbyPage.css'

// 컴포넌트 import
import ChatListPage   from './lobbyPageRoute/chatListPage.jsx';
import FriendListPage from './lobbyPageRoute/friendListPage.jsx';

// 로그인 체크용 Context API import
import { LogContext } from '../../App.jsx'

// Custom hook import
import { useChatSubscriber }  from '../../hooks/chat/useChatSubscriber.js'
import { useChatSender }      from '../../hooks/chat/useChatSender.js'
import { useLoginCheck }      from '../../hooks/login/useLoginCheck.js';
import { useLogout }          from '../../hooks/login/useLogout.js';

function LobbyPage() {

  // 사이드바 프로필 이미지 클릭시 중앙 div는 사라지게 - 기본값 true(중앙 div 표시)
  const [showMidBar, setShowMidBar] = useState(true);

  // toggle State를 기준으로 채팅 / 친구 컴포넌트 교체 - 기본값 true (채팅)
  const [toggle, setToggle] = useState(true);

  const [selectedRoom, setSelectedRoom] = useState();       // 실시간 참여한 채팅방 데이터를 담은 State
  const [messages, setMessages]         = useState([]);     // 보낼 메세지
  const [client, setClient]             = useState(null);   // client 연결 여부 State
  const [input, setInput]               = useState('');     // input 입력 Sate         


  // State 보관함 해체
  const {isLogIn, setIsLogIn, userData} = useContext(LogContext)

  // 커스텀 훅 가져오기
  // --UseEffect
  useLoginCheck(isLogIn);                                     // 로그인 체크 훅
  useChatSubscriber(selectedRoom, setMessages, setClient);    // 채팅방 구독 훅
 
  // -- Function
  const logoutFunc  = useLogout();                                                      // 로그아웃 훅
  const sendMessage = useChatSender(client, selectedRoom, userData, input, setInput);   // 메세지 전송 훅 

  
  // 스크롤 하단 자동 이동 Effect
  const messageContainerRef = useRef(null);

  useEffect(() => {
    const container = messageContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  

  
  
 

  return (
    <div className='fullscreen' style={{display:"flex", padding:"10px"}}>
     
      {/* 좌측 사이드바 - 좌측 사이드바는 showMidBar State를 기준으로 동적 조절*/}
      <div className={`contentStyle ${ showMidBar ? 'sideBarSize' : 'sideBarExpanded' }`}>
        
        {/* 이미지(프로필) 클릭시 사이드바 확장으로 정보 수정 setShowMidBar(false) */}
        {/* showMidBar 값에 따라 다른 css 적용*/}
        <img src="https://placehold.co/375x375" onClick={() =>{ setShowMidBar(false);}}
         className={`${ showMidBar ? 'sideBarImgSize' : 'sideBarImgSizeExpanded' }`} />

         
         {/* showMidBar false일시 정보 수정창 표시 */}
         { showMidBar ? 
          <div>

            <p onClick={()=>{ logoutFunc(setIsLogIn) }}> 로그아웃 </p>

            <p onClick={()=>{ findUser() }}>test</p>
            <p onClick={()=>{ checkRead() }}>안읽은거</p>
            <p onClick={()=>{ readChange() }}>읽음 체크</p>


          </div> 
          : <>
            {/* 정보 수정 */}
            <div className='sideBarDetailSize'>
              정보수정
              <p>ID : {userData.userId}</p>
              <p>Name : {userData.userName}</p>
              <p>Email : {userData.userEmail}</p>
            </div>

            {/* 완료 버튼 클릭시 setShowMidBar true */}
            <div className='sideBarButtonBox'>

              <div className='sideBarButton' onClick={() =>{ setShowMidBar(true); }}>
                완료
              </div>
            </div> 
           </> }
      </div>
  
      {/* 중간 친구/채팅 바 */}
      { showMidBar ? 
        <div className='midBarSize'>

          {/* 토글 버튼 */}
          <div style={{ display: "flex" }}>
            {/* 채팅 토글 */}
            <div onClick={() => {setToggle(true); }}
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
            { toggle ? 
                <ChatListPage 
                  setMessages     = { setMessages }
                  selectedRoom    = { selectedRoom }
                  setSelectedRoom = { setSelectedRoom } /> 
              : <FriendListPage /> }
          </div>
        </div>
      : null }
      
      {/* 우측 채팅방 */}
      <div className='rightBarSize'>

        {/* 상단 채팅창 */}
        <div className='contentStyle chatSize' style={{textAlign:"left"}}>
   
          {/* 메시지 목록 출력 */}
          <div ref={messageContainerRef} className='scroll-container chatDivStyle'>
            {/* 하단에 컴포넌트 선언 */}
            <MessageList 
              messages = { messages } 
              userData = { userData }/>
          </div>
          
          {/* 메세지 입력창 */}
          <div className="inputSize">
            <input
            className='chatInputStyle'
              type="text"
              value={ input }
              onChange  = { (e) => { setInput(e.target.value); }}  // 입력값 업데이트
              onKeyDown = { (e) => { if(e.key === 'Enter') { sendMessage(); } }}/>

            {/* 메시지 전송 버튼 */}
            <button className='chatButtonStyle'
            onClick={ () =>{ sendMessage(); }}> 전송 </button> 
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


const MessageList = memo(({ messages, userData }) => {
  return (
    <div className='chatContentStyle'>
      {
        messages.map((msg, i) => (
          
          <div key={i} style={{ marginTop:"5px" }}
            className={`${ msg.name == userData.userId ? 'myChatStyle' : null} `}>

            <div>{ msg.name }</div>

            <div className='chatStyle'>{ msg.message }</div>

          </div>
        ))
      }
    </div>
  );
});
