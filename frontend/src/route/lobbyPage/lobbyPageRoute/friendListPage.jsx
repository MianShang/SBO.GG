import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';
import './list.css'

function friendListPage() {

  return (
    <div className='listRouteSize contentStyle'>
      친구 리스트
    </div>
  )
}

export default friendListPage
