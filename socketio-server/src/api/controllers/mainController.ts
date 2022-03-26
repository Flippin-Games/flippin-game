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
    @ConnectedSocket() socket: Socket,
    @SocketIO() io: Server
  ) {
    console.log("New Socket connected", socket.id);

    socket.on("disconnecting", (reason) => {
      console.log(socket.rooms.values());
      const room = GameController.getRoomFromState(socket.data.roomId);
      console.log("Discontinuing Socket", socket.id, socket.data, room);
    });
  }

  // TODO this do not seem to be triggered when timmer is running, if there is an need to add action on disconnect during game, check adding socket.on("disconnecting", (reason) => {}) or on disconnect, inside onConnection above or make update inside updateUsers in gameController

  @OnDisconnect()
  public async onDisconnection(
    @ConnectedSocket() socket: Socket,
    @SocketIO() io: Server
  ) {
    const room = GameController.getRoomFromState(socket.data.roomId);
    room.removeUser(socket.data.username);
    GameController.emitUpateGame(io, socket.data.roomId);

    const connectionMessage = `${socket.data.username} Disconnected from Socket  ${socket.id} and room: ${socket.data.roomId}`;
    console.log(connectionMessage);
  }
}
