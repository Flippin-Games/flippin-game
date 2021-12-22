import {
  ConnectedSocket,
  OnConnect,
  OnDisconnect,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Socket, Server } from "socket.io";
import { GameController } from "./gameController";

@SocketController()
export class MainController {
  @OnConnect()
  public onConnection(
    @ConnectedSocket() socket: Socket
    // @SocketIO() io: Server
  ) {
    console.log("New Socket connected", socket.id);
  }

  @OnDisconnect()
  public async onDisconnection(
    @ConnectedSocket() socket: Socket
    // @SocketIO() io: Server
  ) {
    const connectionMessage =
      socket.data.username +
      " Disconnected from Socket " +
      socket.id +
      " and room: " +
      socket.data.roomId;
    GameController.removeUser(socket.data.roomId, socket.data.username);
    console.log(connectionMessage);
  }
}
