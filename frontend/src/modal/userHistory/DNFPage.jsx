import React from 'react';
import './DNFPage.css';

function DNFPage({ dnfStats }) {
  if (!dnfStats) return null;

  const {
    characterName,
    level,
    jobName,
    guildName,
    adventureFame,
    equipment
  } = dnfStats;

  return (
    <div className="dnf-box">
      <div className="basic-info">
        <h2>👤 {characterName}</h2>
        <p>📈 레벨: {level}</p>
        <p>🛡️ 직업: {jobName}</p>
        <p>🏰 길드: {guildName || '없음'}</p>
        <p>🔥 모험가 명성: {adventureFame}</p>
      </div>

      <div className="equipment-section">
        <h3>🧰 장착 장비 목록</h3>
        {equipment && equipment.length > 0 ? (
          <div className="equipment-list">
            {equipment.map((item, index) => (
              <div key={index} className="equipment-item">
                <p>🎒 부위: {item.slotName}</p>
                <p>🧱 이름: {item.itemName}</p>
                <p>📦 종류: {item.itemType}</p>
                <p>💎 등급: {item.itemRarity}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>장착 장비 정보 없음</p>
        )}
      </div>
    </div>
  );
}

export default DNFPage;
