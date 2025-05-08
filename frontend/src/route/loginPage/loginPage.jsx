import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';
import './loginPage.css'

function LoginPage() {

  return (
    <>
        <h1>로그인 페이지임</h1>
        <Link to="/">메인으로</Link>
    </>
  )
}

export default LoginPage
