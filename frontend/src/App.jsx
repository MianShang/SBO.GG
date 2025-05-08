import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';
import './App.css'

{/* 컴포넌트 import */}
import LobbyPage from   './route/lobbyPage/lobbyPage.jsx';
import SearchPage from  './route/searchPage/searchPage.jsx';
import LoginPage from   './route/loginPage/loginPage.jsx';

function App() {

  return (
    <>
    {/* 초기 url 진입점인 "/" 비로그인시 "/login"로 자동연계 되게 할 예정*/}
      <div className='widthSize heightSize'>
        <Routes> 
          <Route path="/"       element={ <LobbyPage/> }> </Route>
          <Route path="/search" element={ <SearchPage/> }></Route>
          <Route path="/login"  element={ <LoginPage/> }> </Route>   
        </Routes>
      </div>
    </>
  )
}

export default App
