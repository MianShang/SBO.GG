import React, { useState } from 'react';
import './CreateRoomModal.css';

function CreateRoomModal({ setOpenModal, onRoomCreated }) {
  const [name, setName] = useState('');
  const [gameName, setGameName] = useState('');

  // 모달 닫기 핸들러
  const handleClose = () => {
    setOpenModal(false);
  };

  // 모달 배경 클릭 처리
  const handleOverlayClick = () => handleClose();
  const handleContentClick = (e) => e.stopPropagation();

  // 방 생성 API 호출
  const createRoom = () => {
    if (!name.trim() || !gameName.trim()) {
      alert("채팅방 이름과 게임을 입력해주세요!");
      return;
    }

    fetch('/api/chat/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatName: name, gameName }),
    })
      .then(async res => {
        if (!res.ok) throw new Error('방 생성 실패');
        return res.json();
      })
      .then(data => {
        onRoomCreated(data);
        handleClose();
      })
      .catch(err => {
        alert('방 생성 중 오류가 발생했습니다.');
        console.error(err);
      });
  };

  return (
    // 모달 전체 배경
    <div className="modalOverlay" onClick={handleOverlayClick}>
      {/* 모달 본문 */}
      <div className="modalContent" onClick={handleContentClick}>
        
        {/* 모달 헤더 */}
        <div className="modalHeader">
          <h3>채팅방 생성</h3>
          <button className="closeBtn" onClick={handleClose}>✖</button>
        </div>

        {/* 입력 폼 영역 */}
        <div className="modalInContent">
          {/* 채팅방 이름 입력 */}
          <div className="formGroup">
            <label>채팅방 이름</label>
            <input className="modalInput" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* 게임 선택 */}
          <div className="formGroup">
            <label>게임 선택</label>
            <select className="modalSelect" value={gameName} onChange={(e) => setGameName(e.target.value)}>
              <option disabled value="">-- 선택 --</option>
              <option value="lol">롤</option>
              <option value="maplestory">메이플스토리</option>
              <option value="lostark">로스트아크</option>
              <option value="maplestory">TFT</option>
              <option value="lostark">던전앤파이터</option>
            </select>
          </div>

          {/* 태그 선택 */}
          <div className="formGroup">
            <label>태그 선택</label>
            {/* 태그 UI 자리 */}
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="footerArea">
          <button className="createBtn" onClick={createRoom}>방 만들기</button>
        </div>
      </div>
    </div>
  );
}

export default CreateRoomModal;
