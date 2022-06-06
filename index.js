require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { init } = require("./socket");

const PORT = process.env.PORT || 3040;

const app = express();
const httpServer = createServer(app);
const io = init(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use("/realtime", require("./routes/utils-route"));

io.on("connection", (socket) => {
  socket.on("subscribe", (id) => {
    socket.join(id);
  });

  socket.on("private_emit", ({ receivers, data }) => {
    try {
      socket.to(receivers).emit("private_emit", data);
    } catch (err) {
      console.log(err);
      socket.to(socket.id).emit("server_error", err.message);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
});

io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

httpServer.listen(3000);
