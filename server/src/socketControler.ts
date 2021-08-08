function onConnect(socket) {
    //register listeners on mongodb controller
    require('./database/MongoConnector').register(socket);
}

module.exports = function (io) {
    io.on('connection', function (socket) {
        console.log("New client connected: "+socket.handshake.query.delivery);
        onConnect(socket);
        
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};