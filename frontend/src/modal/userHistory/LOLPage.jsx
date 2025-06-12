import React, { useState } from 'react';
import './LOLPage.css';

function LOLPage({ riotStats }) {
  if (!riotStats) return null;

  const { tier, rank, lp, wins, losses, level, most } = riotStats;
  const winRate = wins + losses > 0
    ? `${((wins * 100) / (wins + losses)).toFixed(1)}% (${wins}승 ${losses}패)`
    : '-';

  const [selectedMode, setSelectedMode] = useState('solo');
  const tierImageUrl = `https://opgg-static.akamaized.net/images/medals/${tier.toLowerCase()}_${romanToNumber(rank)}.png`;

  return (
    <div className="lol-box">
      <div className="tier-box">
        <img src={tierImageUrl} alt="티어 이미지" className="tier-img" />
        <div className="tier-info">
          <p>🏆 티어: {tier} {rank} ({lp} LP)</p>
          <p>📊 승률: {winRate}</p>
          <p>🔢 레벨: {level}</p>
        </div>
      </div>

      <div className="most-section">
        <p className="most-title">🔥 모스트 챔피언</p>

        <div className="mode-buttons">
          {Object.keys(most).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`mode-button ${selectedMode === mode ? 'active' : ''}`}
            >
              🎮 {mode.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="champion-list">
          {most[selectedMode]?.length === 0 ? (
            <div className="champ-item">
              <p className="empty-text">플레이 기록 없음</p>
            </div>
          ) : (
            most[selectedMode].map((champ, idx) => (
              <div className="champ-item" key={idx}>
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${champ.championName}.png`}
                  alt={champ.championName}
                  className="champ-img"
                />
                <p>#{idx + 1}. {champ.championName} - {champ.count}회</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// 랭크를 숫자로 바꿔주는 함수
function romanToNumber(roman) {
  switch (roman) {
    case 'I': return 1;
    case 'II': return 2;
    case 'III': return 3;
    case 'IV': return 4;
    default: return 0;
  }
}

export default LOLPage;
