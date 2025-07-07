import React from 'react';
import './DNFPage.css';
import '../../route/lobbyPage/lobbyPage.css';





function DNFPage({ dnfStats, serverId, nickname }) {
  if (!dnfStats) return null

  const { characterName, level, jobName, guildName, adventureFame, equipment } = dnfStats

  const imageUrl = `https://img-api.neople.co.kr/df/servers/${dnfStats.serverId}/characters/${dnfStats.characterId}?zoom=2`

  return (
    <div className="dnf-box">

  {/* 이미지 + 기본 정보 수평 배치 */}
  <div className="dnf-top-row">
    <div className="dnf-image">
      <img
        src={imageUrl || "/placeholder.svg?height=100&width=100"}
        alt={`${characterName} 이미지`}
      />
    </div>

    <div className="basic-info">
      <h2>{characterName}</h2>
      <p>레벨: {level}</p>
      <p>직업: {jobName}</p>
      <p>길드: {guildName || "없음"}</p>
      <p>모험가 명성: {adventureFame}</p>
    </div>
  </div>

  {/* 장비 목록 */}
  <div className="equipment-section">
    <h3>장착 장비 목록</h3>
    {equipment && equipment.length > 0 ? (
      <div className="equipment-list scroll-container">
        {equipment.map((item, index) => (
          <div key={index} className="equipment-item">
            <p>부위: {item.slotName}</p>
            <p>이름: {item.itemName}</p>
            <p>종류: {item.itemType}</p>
            <p>등급: {item.itemRarity}</p>
          </div>
        ))}
      </div>
    ) : (
      <p>장착 장비 정보 없음</p>
    )}
  </div>
</div>

  )
}

export default DNFPage;
