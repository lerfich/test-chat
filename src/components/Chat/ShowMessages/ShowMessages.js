import classes from './ShowMessages.module.css'
import PropTypes from 'prop-types';

function ShowMessages({messages, userName}) {

//верстка всех сообщений
  return (
    messages.map((message, index) =>
      (message.userName === userName)
      ? (<div key={message.userName+index} className={classes.messageTrue}>
            <p className={classes.messageText}>{message.text}</p>
            <div>
              <span className={classes.messageSender}>{(message.userName.length > 27 ? (message.userName.slice(0, 40) + "...") : message.userName)}</span>
              <span className={classes.time}>{' '+ message.time}</span>
            </div>
        </div>)
       : (<div key={message.userName+index} className={classes.message}>
            <p className={classes.messageText}>{message.text}</p>
            <div>
              <span className={classes.messageSender}>{(message.userName.length > 27 ? (message.userName.slice(0, 40) + "...") : message.userName)}</span>
              <span className={classes.time}>{' '+ message.time}</span>
            </div>
          </div>
        ))
  );
}

ShowMessages.propTypes = {
    messages: PropTypes.array.isRequired,
    userName: PropTypes.string.isRequired,
}

export default ShowMessages;
