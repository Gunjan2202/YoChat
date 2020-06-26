const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {formatMessage, formatMessage3} = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";







// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Server';
var color=["Red","Blue","Green","#2d309e","#8926a2","#ff6c0a"];


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var messagesCollection;

  


  // Run when client connects
io.on('connection', socket => {
  
  socket.on('joinRoom', ({ username, room }) => {

    var user = userJoin(socket.id, username, room, color.pop());

    socket.join(user.room);

    // Welcome current user
    socket.emit('message1', formatMessage(botName,'Welcome to YoChat'));

    //creating a collection
    messagesCollection=dbo.collection(user.room);
    

    // RETIEVE FROM DATABASE
    messagesCollection.find().toArray(function(err, result) {
    if (err) throw err;
    // console.log(result);
    io.to(socket.id).emit('databasemsg',result);
    });

    // //Display the name of the user at the top
    // socket.emit('message2', formatMessage(botName,`${user.username}`));

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

  

  //emit typing message
  socket.on('usertyping',(data)=>{
    socket.broadcast.emit('usertyping',data)
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
    
    messagesCollection.insertOne(formatMessage3(user.username, msg.msg, user.color, msg.flag, msg.tagmsg),function(err,res){
        console.log('inserted a message to database')
    });

    io.to(user.room).emit('message', formatMessage3(user.username, msg.msg, user.color, msg.flag, msg.tagmsg));
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
  
});



const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
