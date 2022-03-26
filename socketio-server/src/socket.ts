import { useSocketServer } from "socket-controllers";
import { Server } from "socket.io";
import { env } from "process";

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
    socket.on("disconnect", (reason) => {
      console.log(reason);
    });
  });

  const extension = env.NODE_ENV === "development" ? "ts" : "js";

  useSocketServer(io, {
    controllers: [`${__dirname}/api/controllers/*.${extension}`],
  });

  return io;
};
