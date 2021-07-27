const express = require('express')

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

//создаем коллекцию комнат
const rooms = new Map();

//обрабатываем get запрос для проверки существования такой комнаты
//если нашлась подгружаем людей и сообщения
//если не нашлось, создаем пустой массив пользователей и сообщений
app.get('/rooms/:id', (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});

//обрабатываем post запрос для создания новой комнаты (если такой не существует)
app.post('/rooms', (req, res) => {
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
  res.send();
});

//проверяем, существует ли комната с именем из адресной строки
app.get('/:pathNameRoom', (req, res) => {
  const { pathNameRoom } = req.params
  const obj = rooms.has(pathNameRoom) ? true : false
  res.json(obj)
});

//при создании соединения получаем сокет
io.on('connection', (socket) => {

  //слушаем сокет пока не появится новый пользователь
  //подсоединяем сокет к текущей комнате
  //добавляем в коллекцию для текущей комнаты пользователя
  //показываем активных пользователей для всех кроме нового участника
  socket.on('user-joined', ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').values()];
    socket.broadcast.to(roomId).emit('show-active-users', users);
  });

  //при получении события "новое сообщение" создаем объект из текста, времени и имени
  //добавляем этот объект в коллекцию
  //создаем события нового сообщения для остальных пользователей
  socket.on('new-message', ({ roomId, userName, text, time }) => {
    const obj = {
      userName,
      text,
      time,
    };
    rooms.get(roomId).get('messages').push(obj);
    // socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj);
    socket.broadcast.to(roomId).emit('new-message', obj);
  });

  //при получении события "отключение", если удалось удалить из коллекции отключившегося пользователя
  //получаем массив активных пользователей и обновляем его для оставшихся участников
  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        // socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
        socket.broadcast.to(roomId).emit('show-active-users', users);
      }
    });
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
