import { useState, useEffect } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [test, setTest] = useState('');

  function testButton(){

    if(test == ''){
      // 백엔드로는 /api로 시작하는 url로 요청한다
      axios.get('/api/test')
      .then(response => {
        setTest(response.data);
      })
      .catch(error => {
        console.error('에러 발생:', error);
      });
    } else {
      setTest('');
    }
    

  }

  return (
    <>
      <button onClick={()=>{ testButton(); }}>테스트버튼</button>
      <h1>{test}</h1>
    </>
  )
}

export default App
