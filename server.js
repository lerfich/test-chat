const express = require('express')

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

const rooms = new Map();

app.get('/rooms/:id', (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
}); //создание комнаты

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
}); //создание новой комнаты

app.get('/:pathNameRoom', (req, res) => {
  const { pathNameRoom } = req.params
  const obj = rooms.has(pathNameRoom) ? true : false
  res.json(obj)
}); //проверка, существует ли такая комната

io.on('connection', (socket) => {
  socket.on('user-joined', ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').values()];
    // socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
    socket.broadcast.to(roomId).emit('show-active-users', users);
  });

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

server.listen(1337, (err) => {
  if (err) {
    throw Error(err);
  } else {
    console.log('connected successfully');
  }
});
