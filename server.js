const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);





// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Server';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message1', formatMessage(botName,'Welcome to YoChat'));

    //Display the name of the user at the top
    socket.emit('message2', formatMessage(botName,`${user.username}`));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message1',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    

    //////////////////INtegrating NTRU Python file////////////////////////

    var spawn = require("child_process").spawn; 
      
  
    var process = spawn('python',["./ntru.py",msg] ); 
  
    
    process.stdout.on('data', function(data) { 
        console.log(data.toString()); 
    } )
    //////////////////////////////////////////////////////////



    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message1',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
