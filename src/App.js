import './App.css';
import React from 'react';
import axios from 'axios';

import LoginField from './components/LoginField/LoginField.js'
import Chat from './components/Chat/Chat.js'

import reducer from './reducer';
import socket from './socket';

import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import { createBrowserHistory } from "history";

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
   joined: false,
   roomId: null,
   userName: null,
   users: [],
   messages: [],
  });

  const history = createBrowserHistory();
  const pathNameRoom = window.location.pathname.slice(1);

  // const onLogin = async (obj) => {
  //   dispatch({
  //     type: 'JOINED',
  //     payload: obj,
  //   });
  //   socket.emit('user-joined', obj);
  //
  //   const { data } = await axios.get(`/rooms/${obj.roomId}`);
  //
  //   dispatch({
  //     type: 'CURRENT_DATA',
  //     payload: data,
  //   });
  // }; //old version

  // const isRoomExist = async (pathNameRoom) => {
  //   const obj = await axios.get(`/${pathNameRoom}`);
  //   if(pathNameRoom !== '' && obj.data == true){
  //     dispatch({
  //       type: 'SHOULDCREATE',
  //       payload: {pathNameRoom, data}
  //     });
  //   }
  // }

  // const shouldCreateOrJoinRoom = (pathNameRoom, roomId) => {
  //   return (pathNameRoom === roomId) ? 'JOIN' //если roomId уже существует (отправили ссылку)
  //                                   : ((pathNameRoom === '') ? 'CREATE' : 'ERROR');  // вы заходите без id (хотите создать чат) или с неправильным id
  // } //проверка: существует такая комната или нет

  const newOnLogin = async (obj) => {

    const isRoomExist = await axios.get(`/${pathNameRoom}`);
    if(pathNameRoom !== '' && isRoomExist.data == true)
      obj.roomId = pathNameRoom

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

  };


  const getUsers = (users) => {
    dispatch({
      type: 'USER_LIST',
      payload: users,
    });
  };

  const addMessage = message => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message
    });
  };

  React.useEffect(() => {
    socket.on('show-active-users', getUsers);
    socket.on('new-message', addMessage);
  }, []); //отобразить пользователей и предыдущие сообщения

  window.socket = socket;

  return (
    <Router>
      <div className="wrapper">

            {!state.joined
            ?(

                  <LoginField onLogin={newOnLogin}/>
             )
            :(
                  <Redirect to={`/${state.roomId}`}/>
            )}

      </div>
      {/*<Route exact path="/">
        <LoginField onLogin={newOnLogin}/>
      </Route>*/}
      <Route exact path={`/${state.roomId}`}>
        <Chat {...state} onAddMessage={addMessage}/>
      </Route>
      {/*<Route component={NoPageFound} />
        exact path={`${root}/success`}*/
      }
    </Router>
  );
}

export default App;
