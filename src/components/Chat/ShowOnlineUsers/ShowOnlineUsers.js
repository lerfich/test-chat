import classes from './ShowOnlineUsers.module.css'
import PropTypes from 'prop-types';

function ShowOnlineUsers({users, userName}) {
  return (
    <ul className={classes.activeUserList}>
      {users.map((name, index) =>
         (name === userName) ? (<li key={name + index} className={classes.isMyself}> {name.length > 17 ? (name.slice(0, 17) + "...") : name} </li>)
                              : (<li key={name + index} className={classes.isOther}> {name.length > 17 ? (name.slice(0, 17) + "...") : name} </li>)
    )}
    </ul>
  );
}

ShowOnlineUsers.propTypes = {
    users: PropTypes.array.isRequired,
    userName: PropTypes.string.isRequired,
}

export default ShowOnlineUsers;
