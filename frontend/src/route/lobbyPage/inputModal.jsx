import React, { useState } from 'react';
import './inputModal.css';

const dnfServers = ['카인', '디레지에', '시로코', '프레이', '카시야스', '힐더', '안톤', '바칼'];

function InputModal({ type, onClose, sendUserGameCode }) {
  const [gameName, setGameName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [tag, setTag] = useState('');
  const [server, setServer] = useState('');

  const handleSave = () => {
    if (type === 'game') {
      if (!gameName || !gameCode) {
        alert("게임 이름과 코드를 입력해주세요.");
        return;
      }
      const finalCode = gameName === 'dnf' ? `${server}-${gameCode}` : gameCode;
      sendUserGameCode(gameName, finalCode);
    } else if (type === 'tag') {
      if (!tag) {
        alert("#태그를 입력해주세요.");
        return;
      }
      console.log("입력된 태그:", tag); // 여기에 태그 api 연결 ㄱㄱ
    }

    onClose(); 
  };

  return (
    <div className="input-modal-overlay">
      <div className="input-modal-content" style={{ maxWidth: "400px", padding: "1.5rem" }}>
        <h3>{type === 'game' ? "게임 코드 추가" : "태그 추가"}</h3>

        {type === 'game' && (
          <>
            <label>게임 선택</label>
            <select value={gameName} onChange={(e) => setGameName(e.target.value)}>
              <option value="">-- 선택해주세요 --</option>
              <option value="overwatch">오버워치</option>
              <option value="lol">롤</option>
              <option value="maplestory">메이플스토리</option>
              <option value="lostark">로스트아크</option>
              <option value="dnf">던전앤파이터</option>
            </select>

            {gameName === 'dnf' && (
              <>
                <label>던파 서버 선택</label>
                <select value={server} onChange={(e) => setServer(e.target.value)}>
                  <option value="">-- 서버 선택 --</option>
                  {dnfServers.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </>
            )}

            <label>게임 코드</label>
            <input
              type="text"
              placeholder="게임 코드를 입력하세요"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
            />
          </>
        )}

        {type === 'tag' && (
          <>
            <label>#태그 입력</label>
            <input
              type="text"
              placeholder="#태그를 입력하세요"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </>
        )}

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose}>취소</button>
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
}

export default InputModal;
