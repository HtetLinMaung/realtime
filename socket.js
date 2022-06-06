const { Server } = require("socket.io");

let io;
module.exports = {
  init: (server, options = {}) => {
    io = new Server(server, options);
    return io;
  },
  getIO: () => {
    return io;
  },
};
