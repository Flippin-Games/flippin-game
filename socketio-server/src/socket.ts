import { useSocketServer } from "socket-controllers";
import { Server } from "socket.io";

export default (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
  });

  io.on("connection", (socket) => {
    console.log("connection");
  });

  console.log(__dirname + "/api/controllers/*.js");

  useSocketServer(io, { controllers: [__dirname + "/api/controllers/*.js"] });

  return io;
};
