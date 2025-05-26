import axios from 'axios';

export function useLogout(){

    // 로그아웃 처리 API
    function logoutFunc(setIsLogIn) {

        axios.post('/api/logout')
        .then((res) =>{
            console.log(res)
            // 로그아웃시 로그인 여부 Context State FALSE
            setIsLogIn(false);
        })
    .catch((err) => {
      console.error(err);
    });
  }

  return logoutFunc;
}