const mongoose = require("mongoose");

function connect(uri, callback: (error: Error, status: string) => void) {
  return mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      callback(null, "Database connected");
    })
    .catch((error) => {
      callback(error, "Database connection fail");
    });
}

export default connect;