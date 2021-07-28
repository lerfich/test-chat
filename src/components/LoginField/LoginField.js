import React from 'react';
import axios from 'axios';
import  rand  from './../function/randint.js'
import PropTypes from 'prop-types';
import classes from './LoginField.module.css'
import Modal from '../Modal/Modal.js'
import Loader from '../Loader/Loader.js'

function LoginField({ onLogin }){

  //состояния имени пользователя и загрузки
  const [userName, setUserName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  //состояние для модального окна
  const [isModal, setModal] = React.useState(false)

  //функция для закрытия модального окна
  const onClose = () => setModal(false)

  //при нажатии на Enter выполняется попытка входа в чат
  const onKeydown = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'Enter':
        joinRoom();
        break;
      default: break;
    }
  }

  //входим в комнату с именем и roomId
  //отображаем загрузку
  //добавляем пользователя и комнату в коллекцию на сервере
  //меняем состояния на клиентской части
  const joinRoom = async () => {
    try {
      if(!!userName.trim() === false) {
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

  React.useEffect(() => {
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  })

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
          {loading ? <Loader loading={true}/> : 'ВОЙТИ'}
        </button>
      </div>
  );
}

LoginField.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default LoginField;
