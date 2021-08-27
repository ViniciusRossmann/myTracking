import logger from './logger';

let io;
exports.socketConnection = (server, props) => {
  io = require('socket.io')(server, props);
  io.on('connection', (socket) => {
    let deliveryId: string = socket.handshake.query.delivery;
    logger.info(`New client connected to delivery: ${deliveryId}`);
    socket.join(deliveryId);
        
    socket.on("disconnect", () => {
        logger.info(`Client disconnected delivery: ${deliveryId}`);
    });
  });
};

exports.sendMessage = (roomId, key, message) => io.to(roomId).emit(key, message);

exports.getRooms = () => io.sockets.adapter.rooms;
