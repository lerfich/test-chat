import React from 'react';
import socket from '../../socket';

import './Chat.css'

function Chat({ users, messages, userName, roomId, onAddMessage}) {
  const [messageValue, setMessageValue] = React.useState('');
  const messagesRef = React.useRef(null);

  const onSendMessage = () => {
    if(!!messageValue.split(' ').join('') == true){
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

  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 3333);
  }, [messages]);

  return (
      <div className="chat">
        <div className="chat-users">
          Комната: <b>{roomId}</b>
          <hr/>
          <b>Онлайн ({users.length}):</b>
          <ul>
            {users.map((name, index) =>
            (<li key={name + index} className={"active-" + (name === userName)}>{name.length > 17 ? (name.slice(0, 17) + "...") : name}</li>)
          )}
          </ul>
        </div>
        <div className="chat-messages">
          <div ref={messagesRef} className="messages">
            {messages.map((message) => (
              <div className="message">
                <p>{message.text}</p>
                <div>
                  <span>{message.time + (message.userName.length > 27 ? (message.userName.slice(0, 40) + "...") : message.userName)}</span>
                </div>
              </div>
            ))}
          </div>
          <form>
            <textarea
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              className="form-control"
              rows="3"></textarea>
            <button onClick={onSendMessage} type="button" className="btn btn-secondary">
              Отправить
            </button>
          </form>
        </div>
      </div>
  );
}

export default Chat;
