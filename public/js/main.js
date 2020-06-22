const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const mssg=document.getElementById('msg');





// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

var person={username, room};

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});


//send typing message
mssg.addEventListener('keydown',()=>{
  socket.emit('usertyping',person.username)
})


//typing
socket.on('usertyping', data=>{
  const div = document.getElementById('mssg');
  div.classList.add('message');
  div.classList.add('typing');
  outputtyping(data, div);
  setTimeout(function(){ 
      document.querySelector('.typing').innerHTML="";

   }, 1000);
})

// Message from server
socket.on('message', message => {
  if(message.username==person.username)
  {console.log(message);
    console.log(person.username);
    //delete the sent msg so that delievred msg can be shown
    $( document ).ready(function deletemsg() {
    $('#x').remove();
    
    });
    outputMessageright(message);
  }
  
  else{
    console.log(message);
    console.log(person.username);
    outputMessage(message);

  }

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//welcome msg
socket.on('message1', message1 => {
  console.log(message1);
  delwelcome();
  outputMessage1(message1);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// //hi user msg at the top
// socket.on('message2', message2 => {
//   console.log(message2);
//   outputMessage2(message2);


// });



// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  //message sent but not delieverd yet
  outputMessagenoconn(msg);

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//delete welcome connecting msg
function delwelcome()
{
  const hidewel=document.querySelector(".red");
  hidewel.classList.add("del");

}

//output user typing msg
function outputtyping(data, div) {
  div.innerHTML = `
  <p class="text">
    ${data} is typing...
  </p>`;
  
}

// Output message to DOM
function outputMessage(message) {
   
  // document.querySelector('.typing').style.display="none";
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta" style="color:${message.color}">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// Output message to DOM at the right side of the screen
function outputMessageright(message) {
  // document.querySelector('.typing').style.display="none";
  const div = document.createElement('div');
  div.classList.add('message2');
  div.innerHTML = `<p class="meta text"><span>${message.time} <i class="fas fa-check-double"></i></span>${message.text} </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

var x=0;

//output message when no connection
function outputMessagenoconn(message) {
  const div = document.createElement('div');
  div.classList.add('message2');
   div.id="x";
  div.innerHTML = `<p class="meta text"><span id="sent"> sent <i class="fas fa-check"></i></span>${message} </p>`;
  document.querySelector('.chat-messages').appendChild(div);
  
}



// Output message to DOM
function outputMessage1(message1) {
  const div = document.createElement('div');
  div.classList.add('message1');
  div.innerHTML = `<p class="text">${message1.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

//Add the hi msg at the top
function outputMessage2(message2) {
  const div = document.createElement('div');
  div.classList.add('message1');
  div.innerHTML = `<h2 class="text">${message2.text}</h2>`;
  document.querySelector('.hi-msg').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

