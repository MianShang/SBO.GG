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

  const { isLogIn, setIsLogIn, userData } = useContext(LogContext);
  useLoginCheck(isLogIn); // 로그인 체크

  useEffect(() => {
    axios.get('/api/chat/rooms') 
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => console.error('방 목록 가져오기 실패', err));
  }, []);

  function saveUserChatRoom(roomId) {
    axios.post('/api/add/user/chatroom', {
      userId: userData.userId,
      roomId: roomId
    })
    .then(() => {
      console.log("성공");
    })
    .catch((err) => console.error('저장 실패', err));
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

      <div className='fullscreen' style={{ display: "flex", padding: "10px" }}>
        {/* 좌측 사이드바 */}
        <div className='contentStyle leftSize'>
          여긴 카테고리
          <p>ID : {userData.userId}</p>
          <p>Name : {userData.userName}</p>
          <p>Email : {userData.userEmail}</p>
        </div>

        {/* 우측 사이드바 */}
        <div className='rightSize'>
          {/* 검색 바 */}
          <div className='contentStyle searchBarSize'>
            검색창임
          </div>

          {/* 채팅방 리스트 */}
          <div className='contentStyle chatListSize'>
            <div className='chatListScroll'>
              채팅 리스트
              {
                rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => { saveUserChatRoom(room.id); }}
                    style={{ color: "white", border: "1px solid", margin: "10px", height: "50px" }}>
                    <div>{room.name} {room.id}</div>
                  </div>
                ))
              }
            </div>

            {/* 채팅방 생성 */}
            <div className='chatCreate'>
              <button onClick={() => setOpenModal(true)}>방 만들기</button>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;