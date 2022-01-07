import { useContext } from "react";
import gameContext from "../../gameContext";

function Time() {
  const { state } = useContext(gameContext);

  return (
    <section>
      <h2>Time since game started: {state.time}</h2>
      <h2>Time first batch got delivered: {state.timestamp}</h2>
    </section>
  );
}

export default Time;
