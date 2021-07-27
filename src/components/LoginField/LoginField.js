import React from 'react';
import axios from 'axios';
import  rand  from './../function/randint.js'
import PropTypes from 'prop-types';
import classes from './LoginField.module.css'
import globalStyles from '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import cx from 'classnames'

function LoginField({ onLogin }){

  LoginField.propTypes = {
    onLogin: PropTypes.func.isRequired,
  }

  //состояния имени пользователя и загрузки
  const [userName, setUserName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  //входим в комнату с именем и roomId
  //отображаем загрузку
  //добавляем пользователя и комнату в коллекцию на сервере
  //меняем состояния на клиентской части
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
      <div className={classes.loginBlock}>
        <input
          type="text"
          placeholder="Ваше имя"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button disabled={loading} onClick={joinRoom}>
          {loading ? 'ВХОД...' : 'ВОЙТИ'}
          {/*loading ? (<div className={classes.ldsRing}><div></div><div></div><div></div><div></div></div>) : 'ВОЙТИ'*/}
        </button>
      </div>
  );
}


export default LoginField;
