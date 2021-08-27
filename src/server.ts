import routes from "./routes";
import connect from "./db/connect";
import logger from "./logger";
require('dotenv/config');
const express = require('express');
const cors = require('cors')
const app = express();
const server = require('http').createServer(app);
const { socketConnection } = require('./socketControler');

//create websocket server
socketConnection(server, { cors: {}});

//configure express server
app
  .set('port', process.env.port || 3001)
  .use(cors({ origin: '*', credentials:true }))
  .use(express.json())
  .use(routes)

//open express server
server.listen(app.get('port'), () => {
  logger.info(`Server listening at port ${app.get('port')}`);

  //connect to dataserver
  const dbUri = process.env.DB_CONNECT;
  connect(dbUri, (err, status) => {
    if(err){
      logger.error("Database error", err);
      process.exit(1);
    }
    else{
      logger.info(status);
    }
  });
});
