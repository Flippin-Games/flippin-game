import { Socket } from "socket.io-client";

class GameService {
  public async joinGameRoom(
    socket: Socket,
    roomId: string,
    username: string
  ): Promise<{ joined: boolean; users: []; counterValue: number }> {
    return new Promise((resolve, reject) => {
      socket.emit("join_game", { roomId, username });
      // TODO: setting users should be separate thing from room joined
      socket.on("room_joined", (name, users, counterValue) => {
        resolve({ joined: true, users, counterValue });
      });
      socket.on("room_join_error", ({ error }) => {
        reject(error);
      });
    });
  }

  public async updateGame(socket: Socket, counterValue: number) {
    console.log("UPDATE GAME");
    socket.emit("update_game", { counterValue });
  }

  public async onGameUpdate(
    socket: Socket,
    listener: (counterValue: number, users: []) => void
  ) {
    socket.on("on_game_update", ({ counterValue }, users) => {
      listener(counterValue, users);
    });
    console.log("on game update");
  }
}

export default new GameService();
