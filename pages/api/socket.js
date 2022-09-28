import { Server } from "socket.io";

const users = new Set();
const rooms = new Map();

export default (req, res) => {
    if(res.socket.server.io) {
        console.log('Socket is already running');
    }else {
        console.log('Socket is initializing');
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', socket => {

          console.log('connected');
          return;
          
            const id = socket.handshake.query.id;
            
            if(id && !users.has(id)){
              users.add(id);
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
                  socket.emit('recieve-message', {
                    content: message,
                    to: rId
                  })
                  //socket.join(rId)
                  //socket.to(rId).emit('recieve-message', { message, isGroup: recipients.length === 1});
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
          
            socket.on("is-typing", function ({roomId, userId, displayName}) {
              socket.to(roomId).emit("is-typing", {roomId, userId, displayName});
            });

            socket.on("is-idle", function ({roomId, userId, displayName}) {
              socket.to(roomId).emit("is-idle", {roomId, userId, displayName});
            });
          
        })
    }
    res.end();
}
