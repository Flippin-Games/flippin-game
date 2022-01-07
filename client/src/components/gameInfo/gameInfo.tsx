// import { useContext } from "react";
import Time from "../time/time";

// import gameContext from "../../gameContext";

function GameInfo() {
  //   const { state } = useContext(gameContext);
  return (
    <aside>
      <h2>Game stats</h2>
      <Time />
      <p>some other info</p>
      <hr />
    </aside>
  );
}

export default GameInfo;
