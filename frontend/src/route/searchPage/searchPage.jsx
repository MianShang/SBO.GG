import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './searchPage.css';

// 로그인 체크용 Context API import
import { LogContext } from '../../App.jsx';

// custom hook import
import { useLoginCheck } from '../../hooks/login/useLoginCheck.js';

// Modal import
import CreateRoomModal from '../../modal/CreateRoomModal/CreateRoomModal.jsx';

function SearchPage() {
  const [name, setName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [gameName, setGameName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const { isLogIn, setIsLogIn, userData } = useContext(LogContext);
  useLoginCheck(isLogIn); // 로그인 체크

  // 채팅방 목록 불러오기
  useEffect(() => {
    axios.get('/api/chat/rooms', {
      params: { keyword: searchKeyword }
    }).then((res) => setRooms(res.data));
  }, [searchKeyword]);

  function saveUserChatRoom(roomId) {
    axios.post('/api/add/user/chatroom', {
      userId: userData.userId,
      roomId: roomId
    })
    .then(() => {
      console.log("채팅방 참여 기록 저장 완료");
    })
    .catch((err) => console.error('저장 실패', err));
  }

  function createRoom() {
    if (!name || !gameName) {
      alert("게임과 방 이름을 모두 입력해주세요.");
      return;
    }

    axios.post('/api/chat/create', {
      name: name,
      gameName: gameName,
      userId: userData.userId
    })
    .then((res) => {
      setRooms(prev => [...prev, res.data]);
      setName('');
      setGameName('');
    })
    .catch((err) => {
      console.error("방 생성 실패", err);
    });
  }

  return (
    <>
      {openModal && (
        <CreateRoomModal
          setOpenModal={setOpenModal}
          onRoomCreated={(newRoom) => {
            setRooms(prev => [...prev, newRoom]);
          }}
        />
      )}

      {/* 좌측 사이드바 */}
      <div className='contentStyle leftSize'>
        <p>카테고리</p>
        <p>ID : {userData.userId}</p>
        <p>Name : {userData.userName}</p>
        <p>Email : {userData.userEmail}</p>
      </div>

      {/* 우측 사이드바 */}
      <div className='rightSize'>

        {/* 검색 바 */}
        <div className='contentStyle searchBarSize'>
          <input
            type="text"
            placeholder="방 이름 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="searchInput"
          />
        </div>

        {/* 채팅방 리스트 */}
        <div className='chatListScroll contentStyle chatListSize'>
          {
            rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => saveUserChatRoom(room.id)}
                style={{ color: "white", border: "1px solid", margin: "10px", height: "50px", cursor: "pointer" }}
              >
                <div>{room.name}</div>
              </div>
            ))
          }
        </div>

        {/* 채팅방 생성 영역 */}
        <div className='chatCreate'>
          <select value={gameName} onChange={(e) => setGameName(e.target.value)}>
            <option value="" disabled>--선택해주세요--</option>
            <option value="overwatch">오버워치</option>
            <option value="lol">롤</option>
            <option value="maplestory">메이플스토리</option>
            <option value="lostark">로스트아크</option>
          </select>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="방 이름"
          />
          <button onClick={createRoom}>방 만들기</button>
        </div>
      </div>

      {/* 하단 광고 및 알림바 */}
      <div className='bottomSize' style={{ display: "flex" }}>
        <div className='contentStyle searchAdSize'>
          광고든 뭐든 그거
        </div>

        <Link to="/">
          <div className='contentStyle noticeSize'>
            <img src="/MessageIcon.png" className='imgPos' alt="알림" />
          </div>
        </Link>

        <div className='chatCreate'>
          <button onClick={() => setOpenModal(true)}>방 만들기</button>
        </div>
      </div>
    </>
  );
}

export default SearchPage;
