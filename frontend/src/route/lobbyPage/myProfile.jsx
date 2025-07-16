import React, {useState} from 'react';
import InputModal from './inputModal';
import axios from 'axios';
import './myProfile.css';




function MyProfile({ onClose }) {

    const [showGameModal, setShowGameModal] = useState(false);
    const [showTagModal, setShowTagModal] = useState(false);

    function sendUserGameCode(gameName, gameCode){
      
        axios.post('/api/save/gamecode', {
          userId: userData.userId,
          gameName : gameName,
          gameCode : gameCode
        })
        .then((res) => {
          console.log('성공');
        })
        .catch((err) => {
          console.error('실패:', err);
        });
    
      }


  return (
    <div className="modal-overlay">
      <div className="modal-content">

        {/* 닉네임 이미지 좌우배치 */}
        <div className="profile-flex-box getLine">
          <div className="left-box getLine">
            <img src="https://placehold.co/250x250" alt="내 프로필 이미지"  onClick={onClose}/>
            <button onClick={onClose}>X</button>
          </div>

          

          
<div className="right-box getLine">
{/* 닉네임 */}
<h2>Siuugil</h2>
<p>알림 꺼놨음 dm 주셔도 못봐요</p>

{/* 자주 사용하는 태그 */}
<div className="tag-title getLine">자주 사용하는 태그</div>
<span className="add-text" onClick={() => setShowTagModal(true)}>+ 태그 추가</span>
<div className="frequent-tags getLine">
  <span className="tag">#뉴비 환영</span>
  <span className="tag">#마이크 필수</span>
  <span className="tag">#빡겜</span>
  <span className="tag">#ㅎㅎ</span>
  <span className="tag">#ㅋㅇㄴㅁㅇ</span>
  <span className="tag">ㄻㄴㅇㅁ</span>
</div>
</div>
        </div>
        

        {/* 2. 게임 태그 구역 */}
        <div className="tag-box getLine">
          <h3>자주 하는 게임</h3>
          <span className="add-text" onClick={() => setShowGameModal(true)}>+ 게임 추가</span>
          <div className="tag-list getLine">
            <span className="tag">롤</span>
            <span className="tag">오버워치</span>
            <span className="tag">던파</span>
          </div>
        </div>

        {/* 3. 프로필 상세정보 */}
        <div className="bottom-box getLine">
          <h3>내 소개</h3>
          <p>메이플스토리 해야하는데 코딩 하니까 귀찮아졌다</p>
        </div>
      </div>

      {showGameModal && (
        <InputModal
          type="game"
          onClose={() => setShowGameModal(false)}
          sendUserGameCode={sendUserGameCode}
        />
        )}
        {showTagModal && (
        <InputModal
          type="tag"
          onClose={() => setShowTagModal(false)}
        />
        )}
    </div>
  );
}

export default MyProfile;
