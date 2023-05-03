//const { createServer } = require("@graphql-yoga/node");
/* const {instrument } = require('@socket.io/admin-ui');
const express = require("express");
const socket = require("socket.io");
 */
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const PORT = 5600;

const io = new Server(httpServer, {cors: {origin: "*"}});


app.post('/messages', (req, res, next) => {

})

/* Long Polling DEMO */
const connections = [];
/* app.get('/date', (req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  connections.push(res);
});

let tick = 0;
const LIMIT = 20;
if(connections.length){
  setTimeout(function run(){
  
    if(++tick > LIMIT) {
      connections.map(res => {
        res.write('END\n');
        res.end();
      })
      connections = [];
      tick = 0;
      return;
    }
    connections.map((res, index) => {
      res.write(`Hello ${index}: ${tick}\n`);
    });
    setTimeout(run, 1000);
  }, 1000)
}
 */

/* const server = createServer({schema: {typeDefs, resolvers}});

server.start(({port}) => {
    console.log(`Server started on http://localhost:${port}/`);
}) */
const users = new Map();
const rooms = new Map();

/* io.use((socket, next) => {
  console.log(socket.handshake.query);
  next();
}); */

/* 
const jwtMiddleware = (socket, next) => {
  const {token} = socket.handshake.query;
  // verify token
};

io.use(jwtMiddleware);

*/

io.on('connection', socket => {
  const id = socket.handshake.query.id;
  
  if(id && !users.has(id)){
    users.set(id, socket.id);
    console.log(`Adding user ${id}`)
    socket.join(id);
  }
  

  //const id = socket.handshake.query.id;
  

  //const count = io.engine.clientsCount;

  let roomId;

  socket.on("error", (err) => {
    if (err && err.message === "unauthorized event") {
      socket.disconnect();
    }
  });

  socket.on("disconnect", (reason) => {
    // ...
    users.delete(id);
  });

  socket.on('join-room', ({room}) => {
    console.log('join-room called', room);
    socket.join(room);
    
    roomId = room;
  })

  socket.on('leave-room', ({room}) => {
    console.log('join-room called', room);
    socket.leave(room);
    
    roomId = room;
  })

  socket.on('send-message', ({ message }) => {
    console.log(message);
    //socket.to(message.roomId).emit('recieve-message', { message, isGroup: false});
    const recipients = message.recipients || [];
    //socket.to(message.roomId).emit('recieve-message', { message, isGroup: recipients.length === 1});
    recipients.forEach(rId => {
      

      if( rId !== message.senderId ){
        //socket.emit('recieve-message', {message});
        //socket.join(rId)
        console.log('sending to ', rId);
        io.to(users.get(rId)).emit('recieve-message', { message, isGroup: recipients.length === 1});
      }
      //socket.leave(rId);
    });
    /* 
    This also needs to be sent to the user
    */
  });


  socket.on('seen-message', ({ roomId, userId }) => {
    socket.to(roomId).emit("ack-seen-message", { roomId, userId });
  });

  socket.on("typing-state", function ({state, roomId, userId, displayName}) {
    console.log('Typing state', state, userId, displayName);
    socket.to(roomId).emit("ack-typing-state", {state, roomId, userId, displayName});
  });

})

httpServer.listen(PORT, () => {
  console.log(`Listening to PORT: ${PORT}`);
})