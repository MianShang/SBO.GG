import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';
import './routePage.css'

function LogInRoutePage() {


    return (
    <div className="LogRoutePageStyle fullscreen">

        <form className="login-form">
            {/* 상단 로그인 문구 */}
            <div>
                <h1>로그인 </h1>
            </div>

            <input type="text" name="username"
            placeholder="아이디" required/>

            <input type="password" name="password"
            placeholder="비밀번호" required/>

            <button type="submit">로그인</button>
        </form>
    </div>
  );
}
export default LogInRoutePage
