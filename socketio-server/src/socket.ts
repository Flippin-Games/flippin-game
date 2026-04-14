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

  let count = 0;

  io.on("connection", (socket) => {
    count++;
    console.log("CONNECT", socket.id, "TOTAL:", count);

    socket.on("disconnect", (reason) => {
      count--;
      console.log("DISCONNECT", socket.id, "TOTAL:", count);
      console.log(reason);
    });
  });

  const extension = env.NODE_ENV === "development" ? "ts" : "js";

  useSocketServer(io, {
    controllers: [`${__dirname}/api/controllers/*.${extension}`],
  });

  return io;
};
