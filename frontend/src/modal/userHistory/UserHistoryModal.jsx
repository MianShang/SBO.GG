import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserHistoryModal.css';
import LOLPage from './LOLPage';

// 캐시 구조: { [gameCode]: { data: gameData, timestamp: Date.now() } }
const riotCache = {};
const CACHE_DURATION = 60 * 60 * 1000; // 30분 (ms)
const DISPLAY_DELAY = 50 * 1000;       // 1분 지연 (ms)

function UserHistoryModal({ setUserHistoryOpen, historyUserId, sendToModalGameName }) {
  const [isClosing, setIsClosing] = useState(false);          // 모달 닫힘 애니메이션 제어
  const [userGameCode, setUserGameCode] = useState(null);     // 유저 게임 코드 + riotStats 저장
  const [delayedShow, setDelayedShow] = useState(true);       // 화면 표시 제어 (초기값 true)
  const [errorMessage, setErrorMessage] = useState(null);     // 에러 메시지 상태 추가

  // 모달 닫기
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setUserHistoryOpen(false), 150);     // 애니메이션 후 종료
  };

  const handleOverlayClick = () => handleClose();        
  const handleContentClick = (e) => e.stopPropagation();  

  // 게임 아이콘 반환 함수
  function setGameIcon(gameName) {
    switch (gameName) {
      case "overwatch": return "/gameIcons/overwatch_Icon.png";
      case "lol": return "/gameIcons/lol_Icon.png";
      case "valorant": return "/gameIcons/valorant_Icon.png";
      case "maplestory": return "/gameIcons/maplestory_Icon.png";
      case "lostark": return "/gameIcons/lostark_Icon.png";
      default: return "https://placehold.co/45";
    }
  }

  // 게임코드 및 Riot 전적 데이터 불러오기
  useEffect(() => {
    if (!historyUserId || !sendToModalGameName) return;

    setDelayedShow(true); // 기본값은 표시함

    axios.get('/api/get/user/gamedata', {
      params: {
        userId: historyUserId,
        gameName: sendToModalGameName
      }
    })
    .then((res) => {
      const gameCode = res.data?.gameCode;
      if (!gameCode) {
        setUserGameCode(null);
        setErrorMessage("게임 정보를 찾을 수 없습니다."); // gameCode 없을 때 에러 메시지 표시
        return;
      }

      const cached = riotCache[gameCode];
      const now = Date.now();

      const gameData = { gameCode };

      // 캐시가 유효하면 즉시 반영
      if (cached && (now - cached.timestamp < CACHE_DURATION)) {
        console.log("캐시 사용됨");
        setUserGameCode(cached.data);
        setErrorMessage(null); // 캐시 성공 시 에러 초기화
        return;
      }

      // 롤일 경우에만 1분 지연 후 API 호출
      if (sendToModalGameName === 'lol') {
        setDelayedShow(false); // 표시 막기

        // 1분 후에 API 호출
        setTimeout(async () => {
          try {
            const res2 = await axios.get('/riot/stats/by-gamecode', {
              params: { gameCode }
            });

            gameData.riotStats = res2.data;

            riotCache[gameCode] = {
              data: gameData,
              timestamp: Date.now()
            };

            setUserGameCode(gameData);
            setDelayedShow(true); 
            setErrorMessage(null); // 성공 시 에러 초기화
            
          } catch (err2) {
            console.error('라이엇 전적 불러오기 실패', err2);
            setDelayedShow(true); // 실패 시에도 표시 상태 전환
            setErrorMessage("게임 정보를 ㄱㄱ");
          }
        }, DISPLAY_DELAY);

        return; 
      }

      // 롤 외 게임은 바로 표시
      setUserGameCode(gameData);
      setErrorMessage(null); // 다른 게임도 성공 시 에러 초기화
    })
    .catch((err) => {
      console.error('게임코드 불러오기 실패', err);
      setUserGameCode(null);
      setErrorMessage("게임 정보를 불러오지 못했습니다.");
    });

  }, [historyUserId, sendToModalGameName]);

  return (
    <div className="modalOverlay" onClick={handleOverlayClick}>
      <div className={`modalContent ${isClosing ? 'pop-out' : ''}`} onClick={handleContentClick}>

        {/* 모달 헤더 */}
        <div className='modalHeader'>
          <img src={setGameIcon(sendToModalGameName)} alt="게임 아이콘" className="chatCardImage" />
          <h3>{historyUserId ? `${historyUserId} 님의 전적` : "없어"}</h3>
          <div onClick={handleClose}><h3>🗙</h3></div>
        </div>

        {/* 모달 내용 */}
        <div className='modalInContent'>
          <p>{userGameCode ? userGameCode.gameCode : ' '}</p>

          {/* 롤 전적은 1분 후에만 표시 */}
          {sendToModalGameName === 'lol' && delayedShow && (
            <LOLPage riotStats={userGameCode?.riotStats} />
          )}

          {/* 처음 불러오는 경우 1분 대기 문구 표시 */}
          {sendToModalGameName === 'lol' && !delayedShow && (
            <p style={{ color: '#aaa', fontStyle: 'italic', marginTop: '12px' }}>
              🔄 데이터를 불러오는 중입니다. 잠시만 기다려 주세요 (50초)
            </p>
          )}

          {/* 에러 메시지 표시 */}
          {errorMessage && (
            <p style={{ color: 'red', fontWeight: 'bold', marginTop: '16px', textAlign: 'center' }}>
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserHistoryModal;
