import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserHistoryModal.css';
import LOLPage from './LOLPage';
import DNFPage from './DNFPage'; 

const riotCache = {};
const CACHE_DURATION = 60 * 60 * 1000; // 30분 (ms)
const DISPLAY_DELAY = 50 * 1000;       // 1분 지연 (ms)

function UserHistoryModal({ setUserHistoryOpen, historyUserId, sendToModalGameName }) {
  const [isClosing, setIsClosing] = useState(false);
  const [userGameCode, setUserGameCode] = useState(null);
  const [delayedShow, setDelayedShow] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setUserHistoryOpen(false), 150);
  };

  const handleOverlayClick = () => handleClose();
  const handleContentClick = (e) => e.stopPropagation();

  function setGameIcon(gameName) {
    switch (gameName) {
      case "overwatch": return "/gameIcons/overwatch_Icon.png";
      case "lol": return "/gameIcons/lol_Icon.png";
      case "dnf": return "/gameIcons/dnf_Icon.png";
      case "maplestory": return "/gameIcons/maplestory_Icon.png";
      case "lostark": return "/gameIcons/lostark_Icon.png";
      default: return "https://placehold.co/45";
    }
  }

  useEffect(() => {
    if (!historyUserId || !sendToModalGameName) return;

    setDelayedShow(true);

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
          setErrorMessage("게임 정보를 찾을 수 없습니다.");
          return;
        }

        const cached = riotCache[gameCode];
        const now = Date.now();
        const gameData = { gameCode };

        if (cached && (now - cached.timestamp < CACHE_DURATION)) {
          console.log("캐시 사용됨");
          setUserGameCode(cached.data);
          setErrorMessage(null);
          return;
        }

        if (sendToModalGameName === 'lol') {
          setDelayedShow(false);

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
              setErrorMessage(null);

            } catch (err2) {
              console.error('라이엇 전적 불러오기 실패', err2);
              setDelayedShow(true);
              setErrorMessage("게임 정보를 ㄱㄱ");
            }
          }, DISPLAY_DELAY);

          return;
        }

        if (sendToModalGameName === 'dnf') {
          (async () => {
            try {
              const res2 = await axios.get('/dnf/stats/by-gamecode', {
                params: { gameCode }
              });
        
              gameData.dnfStats = res2.data;
              setUserGameCode(gameData);
              setErrorMessage(null);
            } catch (err2) {
              console.error('던파 전적 불러오기 실패', err2);
              setErrorMessage("던파 정보를 불러오지 못했습니다.");
            }
          })();
        
          return;
        }
        setUserGameCode(gameData);
        setErrorMessage(null);
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
        <div className='modalHeader'>
          <img src={setGameIcon(sendToModalGameName)} alt="게임 아이콘" className="chatCardImage" />
          <h3>{historyUserId ? `${historyUserId} 님의 전적` : "없어"}</h3>
          <div onClick={handleClose}><h3>🗙</h3></div>
        </div>

        <div className='modalInContent'>
          <p>{userGameCode ? userGameCode.gameCode : ' '}</p>

          {sendToModalGameName === 'lol' && delayedShow && (
            <LOLPage riotStats={userGameCode?.riotStats} />
          )}

          {sendToModalGameName === 'lol' && !delayedShow && (
            <p style={{ color: '#aaa', fontStyle: 'italic', marginTop: '12px' }}>
              🔄 데이터를 불러오는 중입니다. 잠시만 기다려 주세요 (50초)
            </p>
          )}

          {sendToModalGameName === 'dnf' && (
            <DNFPage dnfStats={userGameCode?.dnfStats} />
          )}

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
