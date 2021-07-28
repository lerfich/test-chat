const express = require('express')

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

//создаем коллекцию комнат
const rooms = new Map();

//обрабатываем get запрос для проверки существования такой комнаты
app.get('/rooms/:id', (req, res) => {
  res.json(getRoomData(req));
});

//обрабатываем post запрос для создания новой комнаты (если такой не существует)
app.post('/rooms', (req, res) => {
  createRoom(req);
  res.send();
});

//проверяем, существует ли комната с именем из адресной строки
app.get('/:pathNameRoom', (req, res) => {
  res.json(isRoomExist(req))
});

//при создании соединения получаем сокет
io.on('connection', (socket) => {

  //ждем появление события "новый пользователь"
  //подсоединяем сокет к текущей комнате
  //показываем активных пользователей для всех кроме нового участника
  socket.on('user-joined', ({ roomId, userName }) => {
    socket.join(roomId);
    const users = addUserToRoom(roomId, userName, socket.id)
    socket.broadcast.to(roomId).emit('show-active-users', users);
  });

  //при получении события "новое сообщение" создаем объект из текста, времени и имени
  //создаем события нового сообщения для остальных пользователей
  socket.on('new-message', ({ roomId, userName, text, time }) => {
    const obj = addNewMessage(roomId, userName, text, time);
    socket.broadcast.to(roomId).emit('new-message', obj);
  });

  //ожидаем событие "отключение",
  //получаем массивы комнат и активных пользователей в них
  //обновляем списки активных участников для остальных
  socket.on('disconnect', () => {
    let {currentRooms, currentUsers} = disconnectUser(socket.id)
    for (let i = 0; i < currentRooms.length; ++i){
      socket.broadcast.to(currentRooms[i]).emit('show-active-users', currentUsers[i]);
    }
  });

  console.log('user connected', socket.id);
});

//прослушиваем порт 1337 на сервере
server.listen(1337, (err) => {
  if (err) {
    throw Error(err);
  } else {
    console.log('connected successfully');
  }
});

//если нашлась подгружаем людей и сообщения
//если не нашлось, создаем пустой массив пользователей и сообщений
function getRoomData(req){
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
      }
    : { users: [], messages: [] };
  return obj;
}

//создаем новую комнату (добавляем к коллекции)
function createRoom(req){
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ]),
    );
  }
}

//проверка, существует ли комната в коллекции
function isRoomExist(req){
  const { pathNameRoom } = req.params
  const obj = rooms.has(pathNameRoom) ? true : false
  return obj;
}

//добавляем в коллекцию для текущей комнаты нового пользователя
function addUserToRoom(roomId, userName, socketId){
  rooms.get(roomId).get('users').set(socketId, userName);
  const users = [...rooms.get(roomId).get('users').values()];
  return users;
}

//создаем объект нового сообщения и добавляем его в коллекцию
function addNewMessage(roomId, userName, text, time){
  const obj = {
    userName,
    text,
    time,
  };
  rooms.get(roomId).get('messages').push(obj);
  return obj;
}

//создаем массивы для активных комнат и пользователей
//если успешно удален пользователь с socketId
//обновляем активные комнаты и списки пользователей в них
function disconnectUser(socketId){
  let currentRooms = [];
  let currentUsers = [];
  rooms.forEach((value, roomId) => {
    if (value.get('users').delete(socketId)) {
      const users = [...value.get('users').values()];
      currentUsers.push(users)
      currentRooms.push(roomId)
    }
  });
  return {currentRooms, currentUsers}
}
