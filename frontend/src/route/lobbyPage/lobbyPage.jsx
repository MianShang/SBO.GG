import { useState, useEffect, useContext } from 'react'
import { Routes, Route, Link, useNavigate  } from 'react-router-dom'
import axios from 'axios';
import './lobbyPage.css'

// 컴포넌트 import
import ChatListPage from './lobbyPageRoute/chatListPage.jsx';
import FriendListPage from './lobbyPageRoute/friendListPage.jsx';

import { LogContext } from '../../App.jsx'


function LobbyPage() {

  // navigate 객체 생성
  const navigate = useNavigate();

  // 사이드바 프로필 이미지 클릭시 중앙 div는 사라지게 - 기본값 true(중앙 div 표시)
  const [showMidBar, setShowMidBar] = useState(true);

  // toggle State를 기준으로 채팅 / 친구 컴포넌트 교체 - 기본값 true (채팅)
  const [toggle, setToggle] = useState(true);

  // State 보관함 해체
  const {isLogIn, setIsLogIn} = useContext(LogContext)

  // 로그인 여부 검사
  useEffect(()=>{
    // 로그아웃 상태로 '/' 접근시 '/login'으로 navigate
    if(!isLogIn) { navigate('/login') }
  },[isLogIn])
  
  // 로그아웃 처리
  function logoutFunc() {
    axios.post('/api/logout')
    .then((res) =>{
      console.log(res)

      // 로그아웃시 로그인 여부 Context false
      // 상단의 Effect가 isLogin 검사 후 바로 로그인 페이지로 이동
      setIsLogIn(false);
    })
    .catch((err) => {
      console.error(err);
    });
  }
  
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
              </div>

              {/* 완료 버튼 */}
              {/* 클릭시 setShowMidBar true*/}
              <div className='sideBarButtonBox'>
                <div className='sideBarButton' onClick={() =>{ setShowMidBar(true);}}>
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
                toggle ? <ChatListPage /> : <FriendListPage />
              }
            </div>
          </div>
        ) : null
      }


      {/* 우측 채팅방 */}
      <div className='rightBarSize'>

        {/* 상단 채팅창 */}
        <div className='contentStyle chatSize'>
          채팅창임
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
