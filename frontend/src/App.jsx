import { useState, useEffect, createContext } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css'

{/* 컴포넌트 import */}
import LobbyPage from   './route/lobbyPage/lobbyPage.jsx';
import SearchPage from  './route/searchPage/searchPage.jsx';
import LoginPage from   './route/loginPage/loginPage.jsx';

// 로그인 체크용 Context 생성
export let LogContext = createContext();

function App() {
  // navigate 객체 생성
  const navigate = useNavigate();

  // 전역 로그인 여부 검사 State
  let [isLogIn, setIsLogIn] = useState(false);
  
  useEffect(()=>{
    axios.get('/api/check-login', { withCredentials: true })
    .then((res) => {
      setIsLogIn(true);
      navigate('/'); // 로비 페이지로
    })
    .catch(() => {
      navigate('/login'); // 로그인 페이지로
    });
  
  },[])

  return (
    <>
    {/* 초기 url 진입점인 "/" 비로그인시 "/login"로 자동연계 되게 할 예정*/}
      <div className='fullscreen'>
        {/* 로그인 여부 State 전역 관리 */}
        <LogContext.Provider value={{ isLogIn, setIsLogIn }}>
          <Routes> 
              <Route path="/"       element={ <LobbyPage/> }> </Route>
              <Route path="/search" element={ <SearchPage/> }></Route>
              <Route path="/login"  element={ <LoginPage/> }> </Route>   
          </Routes>
        </LogContext.Provider>
      </div>
    </>
  )
}

export default App
