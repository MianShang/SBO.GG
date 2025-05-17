import { useState, useEffect, useContext } from 'react'
import { Routes, Route, Link, useNavigate} from 'react-router-dom'
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import './searchPage.css'

// 로그인 체크용 Comtext API import
import { LogContext } from '../../App.jsx'


function SearchPage() {
  // navigate 객체 생성
  const navigate = useNavigate();

  // State 보관함 해체
  const {isLogIn, setIsLogIn} = useContext(LogContext)

  // 로그인 여부 검사 Effect
  // 로그아웃 상태로 '/' 접근시 '/login'으로 navigate
  useEffect(()=>{
    if(!isLogIn) {
      navigate('/login');
    } 
  },[isLogIn])


  const [name, setName] = useState('');
   const [selectedRoom, setSelectedRoom] = useState(null);
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('')

  // 채팅방 생성 API
  function createRoom()  {
    axios.post('/api/chat/rooms', null, {
      params: { name }, // 채팅방 이름 전송
    })
      .then((res) => {
        setName('');     
      })
      .catch((err) => console.error(' 방 생성 실패', err));
  };


  // 채팅방 연결
  useEffect(() => {
    if (!selectedRoom) return;

    setMessages([]); // 방 변경 시 기존 메시지 초기화

    const stomp = new Client({
      brokerURL: `ws://localhost:8080/gs-guide-websocket`,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('STOMP 연결 성공');
        stomp.subscribe(`/topic/chat/${selectedRoom.id}`, (msg) => {
          console.log('받은 메시지 body:', msg.body);
          // 메시지를 새로운 메시지로 업데이트
          setMessages((prev) => [...prev, JSON.parse(msg.body)]);
        });
      },
    });

    stomp.activate();
    setClient(stomp);

    return () => {
      stomp.deactivate(); // 컴포넌트 unmount 시 STOMP 연결 해제
    };
  }, [selectedRoom]); // selectedRoom이 변경될 때마다 실행


  // 메시지 전송
  const sendMessage = () => {
    if (client && input.trim()) {
      client.publish({
        destination: `/app/chat/${selectedRoom.id}`,
        body: JSON.stringify({ name: 'QMatch', message: input }), // 메시지 전송
      });
      setInput(''); // 메시지 전송 후 input 초기화
    }
  };


  return (
    <div className='fullscreen' style={{display:"flex", padding:"10px"}}>

      {/* 좌측 사이드바 */}
      <div className='contentStyle leftSize'>
        여긴 카테고리
      </div>

      {/* 우측 사이드바 */}
      <div className='rightSize'>

        {/* 검색 바 */}
        <div className='contentStyle searchBarSize'>
          검색창임
        </div>


        {/* 채팅방 리스트 */}
        <div className='contentStyle chatListSize'>
          <div>
            <input type="text" value={name} placeholder="채팅방 이름"
              onChange={(e) => setName(e.target.value)}
              className="create-room-input"
            />
            <button onClick={createRoom}>방 만들기</button>
          </div>
        </div>
          

        {/* 하단 광고 및 알림바*/}
        <div className='bottomSize' style={{display:"flex"}}>

          {/* 광고바 */}
          <div className='contentStyle searchAdSize'>
            광고든 뭐든 그거
          </div>

          {/* 로비페이지 버튼*/}
          <Link to="/">
            <div className='contentStyle noticeSize'>
              <img src="/MessageIcon.png" className='imgPos'></img>
            </div>
          </Link>
        </div>    
      </div>

    </div>
  )
}

export default SearchPage
