import { useState, useEffect, useContext  } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';
import './loginPage.css'

import LogInRoutePage from './loginPageRoute/loginRoutePage';
import SignUpRoutePage from './loginPageRoute/signupRoutePage';

import { LogContext } from '../../App.jsx'

function LoginPage() {
  // 기본값은 로그인 페이지로
  const [isResister, setIsRegister] = useState(false);

  // State 보관함 해체
  let {isLogIn, setIsLogIn}  = useContext(LogContext);

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
      
    </div>
  )
}

export default LoginPage
