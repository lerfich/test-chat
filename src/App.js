import classes from './App.module.css';
import React from 'react';
import axios from 'axios';

import LoginField from './components/LoginField/LoginField.js'
import Chat from './components/Chat/Chat.js'
import Modal from './components/Modal/Modal.js'

import reducer from './reducer';
import socket from './socket';

import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'


function App() {
  const [state, dispatch] = React.useReducer(reducer, {
   joined: false,
   roomId: null,
   userName: null,
   users: [],
   messages: [],
  });

  //состояние для модального окна
  const [isModal, setModal] = React.useState(false)

  //функция для закрытия модального окна
  const onClose = () => setModal(false)

  //сохраняем номер комнаты из адресной строки (возможно без номера комнаты)
  const pathNameRoom = window.location.pathname.slice(1);

  //при входе проверяем, есть ли в коллекции такая комната
  //если в коллекции нашлась такая комната, устанавливаем номер комнаты, к которой подключаемся
  //обновляем состояние пользователя, его комнаты
  //отправляем этот объект на сервер, чтобы подключиться к сокету, обновить коллекцию и уведомить других пользователей
  //получаем информацию о дугих пользователях в комнате, обновляем состояние комнаты
  const onLogin = async (obj) => {
    try {
      const isRoomExist = await axios.get(`/${pathNameRoom}`);
      if(pathNameRoom !== '' && isRoomExist.data === true){
        obj.roomId = pathNameRoom
      } else if (isRoomExist.data === false){
        // alert('Такой комнаты не существует, для Вас будет создана новая')
        setModal(true);
      }

      dispatch({
        type: 'JOINED',
        payload: obj,
      });
      socket.emit('user-joined', obj);

      const { data } = await axios.get(`/rooms/${obj.roomId}`);

      dispatch({
        type: 'CURRENT_DATA',
        payload: data,
      });
    } catch(err) {
      console.log(`Ошибка: ${err}`)
    }

  };

  //функция для обновления состояния пользователей в комнате
  const getUsers = (users) => {
    try {
      dispatch({
        type: 'USER_LIST',
        payload: users,
      });
    } catch(err) {
      console.log(`Ошибка: ${err}`)
    }
  };

  //функция для обновления состояния сообщения в комнате
  const addMessage = (message) => {
    try {
      dispatch({
        type: 'NEW_MESSAGE',
        payload: message
      });
    } catch(err) {
      console.log(`Ошибка: ${err}`)
    }
  };

  //устанавливаем сокеты на обработку появления новых пользователей и новых сообщений
  React.useEffect(() => {
    socket.on('show-active-users', getUsers);
    socket.on('new-message', addMessage);
  }, []);

  window.socket = socket;

  return (
    <Router>
      <Modal
          visible={isModal}
          content={<p>Такой комнаты не существует, для Вас была создана новая</p>}
          footer={<button onClick={onClose}>Закрыть</button>}
          onClose={onClose}
      />
      <div className={classes.wrapper}>
            {!state.joined
            ?(

                  <LoginField onLogin={onLogin}/>
             )
            :(
                  <Redirect to={`/${state.roomId}`}/>
            )}
      </div>
      <Route exact path={`/${state.roomId}`}>
        <Chat {...state} onAddMessage={addMessage}/>
      </Route>
    </Router>
  );
}

export default App;
