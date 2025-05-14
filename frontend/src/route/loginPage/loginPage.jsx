import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';
import './loginPage.css'

import LogInRoutePage from './loginPageRoute/loginRoutePage';
import SignUpRoutePage from './loginPageRoute/signupRoutePage';

function LoginPage() {
  // 기본값은 로그인 페이지로
  const [isResister, setIsRegister] = useState(false);

  return (
    <div className='fullscreen position'>

      <div className='LogComponentStyle'>
        {
          isResister ? <SignUpRoutePage/> : <LogInRoutePage/>
        }
      </div>


      <div className='LogChangeButtonStyle' onClick={()=>{setIsRegister(!isResister)}}>
        {
          isResister ? <h2>Login</h2> : <h2>Signup</h2>
        }
      </div>
      
      {/* 개발시 테스트 위해 남겨둠 삭제 예정*/}
      <Link to="/">메인으로</Link>
    </div>
  )
}

export default LoginPage
