import React from 'react';
import socket from '../../socket';
import PropTypes from 'prop-types';
import classes from './Chat.module.css'
import globalStyles from '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import cx from 'classnames'
function Chat({ users, messages, userName, roomId, onAddMessage}) {

  Chat.propTypes = {
    users: PropTypes.array.isRequired,
    messages: PropTypes.array.isRequired,
    userName: PropTypes.string.isRequired,
    roomId: PropTypes.string.isRequired,
    onAddMessage: PropTypes.func.isRequired,
  }

  //состояние текста сообщения
  //ref чтобы можно было сохранить мутируемое свойство .current
  const [messageValue, setMessageValue] = React.useState('');
  const messagesRef = React.useRef(null);

  //при отправке сообщения проверяем, не пусто ли оно
  //отправляем сообщение (имя пользователя, комнату, текст и время) на сервер, чтобы добавить в коллекцию
  //меняем состояния на клиентской части
  const onSendMessage = () => {
    if(!!messageValue.split(' ').join('') === true){
      const time = new Date().toString().slice(16, 21) + ' ';
      socket.emit('new-message', {
        userName,
        roomId,
        text: messageValue,
        time,
      });
      onAddMessage({ userName, text: messageValue, time});
      setMessageValue('');
    } else {
      alert('Введите сообщение');
    }
  };

  //если добавляется сообщение, прокручиваем вниз чат
  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 3333);
  }, [messages]);

  return (
      <div className={classes.chat}>
        <div className={classes.chatUsers}>
          Комната: <b>{roomId}</b>
          <hr/>
          <b>Онлайн ({users.length}):</b>
          <ul className={classes.activeUserList}>
            {users.map((name, index) =>
               (name === userName) ? (<li key={name + index} className={classes.isMyself}> {name.length > 17 ? (name.slice(0, 17) + "...") : name} </li>)
                                    : (<li key={name + index} className={classes.isOther}> {name.length > 17 ? (name.slice(0, 17) + "...") : name} </li>)
            // (<li key={name + index} className={"active-" + (name === userName)}>{name.length > 17 ? (name.slice(0, 17) + "...") : name}</li>)
          )}
          </ul>
        </div>
        <div className={classes.chatMessages}>
          <div ref={messagesRef} className={classes.messages}>
            {messages.map((message) =>
              (message.userName === userName)
              ? (<div className={classes.messageTrue}>
                    <p className={classes.messageText}>{message.text}</p>
                    <div>
                      <span className={classes.messageSender}>{(message.userName.length > 27 ? (message.userName.slice(0, 40) + "...") : message.userName)}</span>
                      <span className={classes.time}>{' '+ message.time}</span>
                    </div>
                </div>)
               : (<div className={classes.message}>
                    <p className={classes.messageText}>{message.text}</p>
                    <div>
                      <span className={classes.messageSender}>{(message.userName.length > 27 ? (message.userName.slice(0, 40) + "...") : message.userName)}</span>
                      <span className={classes.time}>{' '+ message.time}</span>
                    </div>
                  </div>
                ))}
            </div>
          <form className={classes.formMessages}>
            <textarea
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              className={classes.formArea}
              rows="3"></textarea>
            <button onClick={onSendMessage} type="button" className={cx(globalStyles.btn, globalStyles['btn-secondary'])}>
              Отправить
            </button>
          </form>
        </div>
      </div>
  );
}

export default Chat;
