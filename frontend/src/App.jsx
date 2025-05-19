import { useState, useEffect, createContext } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css'

{/* 컴포넌트 import */}
import LobbyPage from   './route/lobbyPage/lobbyPage.jsx';
import SearchPage from  './route/searchPage/searchPage.jsx';
import LoginPage from   './route/loginPage/loginPage.jsx';

// 로그인 체크용 Context API 생성
export let LogContext = createContext();

function App() {
  // navigate 객체 생성
  const navigate = useNavigate();

  // 전역 로그인 여부 State
  let [isLogIn, setIsLogIn] = useState(false);

  // 전역 유저 데이터 State
  let [userData, setUserData] = useState({userId : null,
                                          userName : null,
                                          userEmail : null });
                              
  // 새로고침 or 첫 로딩시 자동 실행
  useEffect(() => {
    // 세션 유효성 검사 API
    // 세션이 유효할 시 유저 정보를 가져온다
    axios.get('/api/check-login', { withCredentials: true })
      .then(() => {
        setIsLogIn(true);   // 로그인 체크용 State TRUE

        // 유저 정보 Get
        axios.get('/api/user/get-data', { withCredentials: true })
          .then((res) => {
            //console.log(res.data);

            // 전역으로 관리할 유저 데이터 State Set
            const { userId, userName, userEmail } = res.data;
            setUserData({ userId, userName, userEmail }); 
          })
          
        navigate('/');      // 로비 페이지로
      })
      .catch(() => {
        setIsLogIn(false);  // 로그인 체크용 State FALSE
        navigate('/login'); // 로그인 페이지로
      });

      // 10분마다 반복 실행, 유저 데이터 Set 을 제외하면 로직은 위 코드와 동일하다
      // 서버에 세션은 사라졌지만 웹 조작을 통한 악성유저 방지
      const interval = setInterval(() => {
        axios.get('/api/check-login', { withCredentials: true })
          .then((res) => {
            console.log("Check LogIn")
            setIsLogIn(true);
          })
          .catch(() => {
            setIsLogIn(false);
            navigate('/login');
        });
      }, 10 * 60 * 1000); // 10분마다 반복

      // 언마운트 시 반복 중지
      return () => clearInterval(interval); 
    }, []);


  return (
    <>
    {/* 초기 url 진입점인 "/" 비로그인시 "/login"로 자동연계 되게 할 예정*/}
      <div className='fullscreen'>
        {/* 로그인 여부, 유저 데이터 State 전역 관리 */}
        <LogContext.Provider value={{ isLogIn, setIsLogIn, userData, setUserData }}>
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
