import { useEffect } from 'react'
import { Routes, Route, Link, useNavigate  } from 'react-router-dom'

export function useLoginCheck(isLogIn){

    const navigate = useNavigate();

    // 로그인 여부 검사 Effect
    // 로그아웃시 isLogIn State의 변화에 의해 실행
    // 로그아웃 상태로 '/' 접근시 '/login'으로 navigate
    useEffect(()=>{
        if(!isLogIn) { navigate('/login'); }
    },[isLogIn])

}