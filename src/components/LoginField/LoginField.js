import React from 'react';
import axios from 'axios';
import  rand  from './../function/randint.js'
import PropTypes from 'prop-types';
import classes from './LoginField.module.css'
import Modal from '../Modal/Modal.js'

function LoginField({ onLogin }){

  //состояния имени пользователя и загрузки
  const [userName, setUserName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  //состояние для модального окна
  const [isModal, setModal] = React.useState(false)

  //функция для закрытия модального окна
  const onClose = () => setModal(false)

  //входим в комнату с именем и roomId
  //отображаем загрузку
  //добавляем пользователя и комнату в коллекцию на сервере
  //меняем состояния на клиентской части
  const joinRoom = async () => {
    try {
      if(!userName) {
        // return alert('Введите имя');
        setModal(true);
        return;
      }

      let roomId = String(rand(1000, 100000));

      const obj = {
        roomId,
        userName,
      }

      setLoading(true);
      await axios.post('/rooms', obj);
      onLogin(obj);
    } catch(err) {
      console.log(`Ошибка: ${err}`)
    }
  };

  return (
      <div className={classes.loginBlock}>
        <Modal
            visible={isModal}
            content={<p>Введите имя</p>}
            footer={<button onClick={onClose}>Закрыть</button>}
            onClose={onClose}
        />
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

LoginField.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default LoginField;
