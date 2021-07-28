const reducer = (state, action) => {
  switch (action.type) {
    case 'JOINED':
      return {
        ...state,
        joined: true,
        userName: action.payload.userName,
        roomId: action.payload.roomId,
      };

    case 'CURRENT_DATA':
      return {
        ...state,
        users: action.payload.users,
        messages: action.payload.messages,
      };

    case 'USER_LIST':
      return {
        ...state,
        users: action.payload,
      };

    case 'NEW_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case 'SHOULDCREATE':
      console.log(action, 'action')
      return {
        ...state,
        joined: true,
        userName: action.payload.obj.userName,
        roomId: action.payload.pathNameRoom,
      };

    default:
      return state;
  }
};
export default reducer;
