import React from 'react';
import socket from '../../socket';
import PropTypes from 'prop-types';
import classes from './Chat.module.css'
import globalStyles from '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import cx from 'classnames'
import ShowMessages from './ShowMessages/ShowMessages.js'
import ShowOnlineUsers from './ShowOnlineUsers/ShowOnlineUsers.js'
import Modal from '../Modal/Modal.js'
import Loader from '../Loader/Loader.js'

function Chat({ users, messages, userName, roomId, onAddMessage, loading}) {
  //состояние текста сообщения, сообщения
  //ref чтобы можно было сохранить мутируемое свойство .current
  const [messageValue, setMessageValue] = React.useState('');
  const messagesRef = React.useRef(null);
  const textAreaRef = React.useRef(null);

  //состояние для модального окна
  const [isModal, setModal] = React.useState(false)

  //функция для закрытия модального окна
  const onClose = () => setModal(false)

  //при нажатии на Enter сообщение отправляется
  const onKeydown = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'Enter':
        onSendMessage();
        break;
      default: break;
    }
  }

  //при отправке сообщения проверяем, не пусто ли оно
  //отправляем сообщение (имя пользователя, комнату, текст и время) на сервер, чтобы добавить в коллекцию
  //меняем состояния на клиентской части
  const onSendMessage = () => {
    try {
      // if(!!messageValue.split(' ').join('') === true){
      if(!!messageValue.replace(new RegExp("\\r?\\n", "g"), "") === true){
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
        setModal(true);
      }
    } catch(err) {
      console.log(`Ошибка: ${err}`)
    }
  };

  //если добавляется сообщение, прокручиваем вниз чат
  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 3333);
  }, [messages]);

  // React.useEffect(() => {
  //   if(textAreaRef.current.focus())
  //   messagesRef.current.scrollTo(0, 3333);
  // }, [textAreaRef.current.focus()]);

  React.useEffect(() => {
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  })

  return (
      <div className={classes.chat}>
        <Modal
            visible={isModal}
            content={<p>Введите сообщение</p>}
            footer={<button onClick={onClose}>Закрыть</button>}
            onClose={onClose}
        />
        <div className={classes.chatUsers}>
          Комната: <b>{roomId}</b>
          <hr/>
          <b>Онлайн ({users.length}):</b>
          <ShowOnlineUsers users={users} userName={userName}/>
          <Loader loading={loading}/>
        </div>
        <div className={classes.chatMessages}>
          <div ref={messagesRef} className={classes.messages}>
                <ShowMessages messages={messages} userName={userName}/>
          </div>
          <form className={classes.formMessages}>
            <textarea
              ref={textAreaRef}
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              className={classes.formArea}
              rows="3"/>
            <button onClick={onSendMessage} type="button" className={cx(globalStyles.btn, globalStyles['btn-secondary'])}>
              Отправить
            </button>
          </form>
        </div>
      </div>
  );
}

Chat.propTypes = {
    users: PropTypes.array.isRequired,
    messages: PropTypes.array.isRequired,
    userName: PropTypes.string,
    roomId: PropTypes.string,
    onAddMessage: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
}

export default Chat;
