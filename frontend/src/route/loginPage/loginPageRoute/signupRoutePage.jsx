import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';
import './routePage.css'


function SignUpRoutePage() {


  return (
    <div className='fullscreen LogRoutePageStyle'>
        <form className="login-form">
        <h1>회원가입</h1>

        <input type="text" name="userId" 
            placeholder="아이디" required/>

        <input type="password" name="userPw"
          placeholder="비밀번호"required/>

        <input type="text" name="userName"
          placeholder="이름" required/>

        <input type="email" name="userEmail"
          placeholder="이메일" required/>

        <button type="submit">회원가입</button>
      </form>
    </div>
  )
}

export default SignUpRoutePage
