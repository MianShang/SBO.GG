import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';
import './routePage.css'


function SignUpRoutePage() {

  // 유저 State
  // 유저 프로필 이미지는 추후 추가 예정
  const [user, setUser] = useState({
    userId: '',
    userPw: '',
    userName: '',
    userEmail: '',
  });

  // input 값 state 자동 적용
  function handleChange(e) {
    // 현재 입력중인 input의 id, value 가져옴
    const { id, value } = e.target;
    // User State 세팅
    setUser(prev => ({ ...prev, [id]: value}));
  }

  // 회원가입 
  function userJoin(e) {
    e.preventDefault();

    // Axios POST
    axios.post('/api/user/join', user)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className='fullscreen LogRoutePageStyle'>
        <form className="login-form" onSubmit={ userJoin }>
        <h1>회원가입</h1>

        <input type="text" id="userId" placeholder="아이디" required
            value={user.userId} onChange={handleChange}/>

        <input type="password" id="userPw" placeholder="비밀번호" required
          value={user.userPw} onChange={handleChange}/>

        <input type="text" id="userName" placeholder="이름" required
         value={user.userName} onChange={handleChange}/>

        <input type="email" id="userEmail" placeholder="이메일" required
          value={user.userEmail} onChange={handleChange}/>

        <button type="submit">회원가입</button>
      </form>
    </div>
  )
}

export default SignUpRoutePage
