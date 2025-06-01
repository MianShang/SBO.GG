import React, { useEffect, useState } from 'react';

import './UserHistoryModal.css'; // 필요한 스타일 분리

function UserHistoryModal({ setUserHistoryOpen, historyUserId }) {

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

  return (
    <div className="modalOverlay" onClick={handleOverlayClick}>
      <div className={`modalContent ${isClosing ? 'pop-out' : ''}`} onClick={handleContentClick}>

        <div className='modalHeader'>
          <h3>{historyUserId ? historyUserId : "없어"} 님의 전적</h3>

          <div onClick={handleClose}>
            <h3>🗙</h3>
          </div>
        </div>

        <div className='modalInContent'>
          전적 데이터
        </div>

      </div>
    </div>
  );
}

export default UserHistoryModal;
