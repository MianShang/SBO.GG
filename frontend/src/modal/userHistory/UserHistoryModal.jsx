import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserHistoryModal.css'; // 필요한 스타일 분리

/*
  이 컴포넌트는 유저 전적 검색을 위한 컴포넌트
  historyUserId : 검색할 유저 ID
  sendToModalGameName : 해당 게임 이름 
*/
function UserHistoryModal({ setUserHistoryOpen, historyUserId, sendToModalGameName }) {

const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true); // 닫기 애니메이션 시작
    setTimeout(() => {
      setUserHistoryOpen(false); // 애니메이션 끝난 뒤 닫기
    }, 150); // popOut duration과 맞춤
  };

    // 바깥 클릭 시 닫기
  const handleOverlayClick = (e) => {
    handleClose();
  };

  // 안쪽 클릭은 닫힘 방지
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

   // 채팅방 속성 중 게임 이름에 따른 아이콘 세팅 함수
  function setGameIcon(gameName){
    switch(gameName)
    {
      case "overwatch" :
        return "/gameIcons/overwatch_Icon.png";

      case "lol" :
        return "/gameIcons/lol_Icon.png";

      case "valorant" :
        return "/gameIcons/valorant_Icon.png";

      case "maplestory" :
        return "/gameIcons/maplestory_Icon.png";

       case "lostark" :
        return "/gameIcons/lostark_Icon.png";

      default:
        return "https://placehold.co/45";
    }
  }

  const [userGameCode, setUserGameCode] = useState('');

  useEffect(()=>{
    if (!historyUserId || !sendToModalGameName) return;

    axios.get('/api/get/user/gamedata', { 
      params: {
        userId: historyUserId,
        gameName: sendToModalGameName
      }})
      .then((res) => {
        console.log(res.data)
        setUserGameCode(res.data)
      })
      .catch((err) => console.error('실패3', err));
  },[historyUserId, sendToModalGameName])


  return (
    <div className="modalOverlay" onClick={ handleOverlayClick }>
      <div className={`modalContent ${isClosing ? 'pop-out' : ''}`} onClick={handleContentClick}>

        <div className='modalHeader'>
            <img src={`${setGameIcon(sendToModalGameName)}`} alt="방 아이콘" className="chatCardImage" />
            <h3>{historyUserId ? historyUserId : "없어"} 님의 전적</h3>

          <div onClick={handleClose}>
            <h3>🗙</h3>
          </div>
        </div>

        <div className='modalInContent'>
          <p> { userGameCode ? userGameCode.gameCode : '해당 유저의 게임코드가 없음'}</p>
        </div>

      </div>
    </div>
  );
}

export default UserHistoryModal;
