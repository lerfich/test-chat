import classes from './ShowMessages.module.css'
import PropTypes from 'prop-types';

function ShowMessages({messages, userName}) {

  return (
    messages.map((message) =>
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
        ))
  );
}

ShowMessages.propTypes = {
    messages: PropTypes.array.isRequired,
    userName: PropTypes.string.isRequired,
}

export default ShowMessages;
