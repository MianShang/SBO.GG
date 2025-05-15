import { useState, useEffect, useContext } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import './routePage.css'

// 로그인 체크용 Context import
import { LogContext } from '../../../App.jsx'

function LogInRoutePage() {
  const navigate = useNavigate();

  // State 보관함 해체
  let {isLogIn, setIsLogIn}  = useContext(LogContext);

  console.log(isLogIn)

  // ID, PW 받을 State
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  // State 자동 입력
  function handleChange(e) {
    const { name, value } = e.target;

    setCredentials(function (prev) {
      return {...prev, [name]: value};
    });
  }
    
  // 로그인 처리 함수
  function handleSubmit(e) {
    e.preventDefault();

    // HTML 폼 형식으로 데이터 보내기 위함
    const params = new URLSearchParams();

    params.append('username', credentials.username);
    params.append('password', credentials.password);

    // HTML 폼 형식 (x-www-form-urlencoded)
    // username=입력한아이디&password=입력한비밀번호 이런식으로 드감
    axios.post('/api/loginProc', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    })
    .then((res) => {
      // 로그인 성공시 반환 데이터 출력
      console.log(res)

      setIsLogIn(true);

      // 로그인 성공시 로비 컴포넌트로('/')
      navigate('/');

      // 로그인 성공시 유저 정보 받기
      axios.get('/api/user/get-data', { withCredentials: true })
      .then((res) => {
        console.log(res.data);
      })

    })
    .catch((err) => {
      console.error(err);
    });
  }


    return (
        <div className="LogRoutePageStyle fullscreen">

            <form className="login-form" onSubmit={handleSubmit}>
                {/* 상단 로그인 문구 */}
                <div>
                    <h1>로그인 </h1>
                </div>

                <input type="text" name="username" placeholder='ID' required
                    value={credentials.username} onChange={handleChange} />
                <input type="password" name="password" placeholder='PW' required
                    value={credentials.password} onChange={handleChange} /> 

                <button type="submit">로그인</button>
            </form>
        </div>
  );
}
export default LogInRoutePage
