import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';
import './searchPage.css'

function SearchPage() {

  return (
    <div className='fullscreen' style={{display:"flex", padding:"10px"}}>

      {/* 좌측 사이드바 */}
      <div className='contentStyle leftSize'>
        여긴 카테고리
      </div>

      {/* 우측 사이드바 */}
      <div className='rightSize'>

        {/* 검색 바 */}
        <div className='contentStyle searchBarSize'>
          검색창임
        </div>


        {/* 채팅방 리스트 */}
        <div className='contentStyle chatListSize'>
          채팅방 리스트
        </div>
          

        {/* 하단 광고 및 알림바*/}
        <div className='bottomSize' style={{display:"flex"}}>

          {/* 광고바 */}
          <div className='contentStyle searchAdSize'>
            광고든 뭐든 그거
          </div>

          {/* 로비페이지 버튼*/}
          <Link to="/">
            <div className='contentStyle noticeSize'>
              <img src="/MessageIcon.png" className='imgPos'></img>
            </div>
          </Link>
        </div>    
      </div>

    </div>
  )
}

export default SearchPage
