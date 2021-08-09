let io;
exports.socketConnection = (server, props) => {
  io = require('socket.io')(server, props);
  io.on('connection', (socket) => {
    let deliveryId: string = socket.handshake.query.delivery;
    console.log("New client connected: "+deliveryId);
    socket.join(deliveryId);
        
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
  });
};

exports.sendMessage = (roomId, key, message) => io.to(roomId).emit(key, message);

exports.getRooms = () => io.sockets.adapter.rooms;
