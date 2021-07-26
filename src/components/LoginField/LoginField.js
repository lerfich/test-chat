import React from 'react';
import axios from 'axios';
import  rand  from './../function/randint.js'

import './LoginField.css'

function LoginField({ onLogin }){

  // const [roomId, setRoomId] = React.useState(''); //больше не задаем
  const [userName, setUserName] = React.useState('');
  const [loading, setLoading] = React.useState(false);


  // const onEnter = async () => {
  //   if (!roomId || !userName) {
  //     return alert('Неверные данные');
  //   }
  //
  //   const obj = {
  //     roomId,
  //     userName,
  //   };
  //
  //   setLoading(true);
  //   await axios.post('/rooms', obj);
  //   onLogin(obj);
  // }; // old version

  const joinRoom = async () => {
    if(!userName) {
      return alert('Введите имя');
    }

    let roomId = String(rand(1000, 100000));

    const obj = {
      roomId,
      userName,
    }

    setLoading(true);
    await axios.post('/rooms', obj);
    onLogin(obj);
  };

  return (
      <div className="login-block">
        {/*<input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)} //более не задаем
        /> */}
        <input
          type="text"
          placeholder="Ваше имя"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button disabled={loading} onClick={joinRoom} className="btn btn-success">
          {loading ? 'ВХОД...' : 'ВОЙТИ'}
        </button>
      </div>
  );
}



export default LoginField;
