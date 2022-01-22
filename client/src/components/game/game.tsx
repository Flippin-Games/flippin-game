import { useContext, useEffect } from "react";

import gameContext from "../../gameContext";
import PlayerCard from "../playerCard/playerCard";

import styles from "./game.module.scss";

function Game() {
  console.log("Game RERENDER");

  const { state } = useContext(gameContext);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <section className={styles.wrapper}>
      {state.users?.map((user: any) => (
        <PlayerCard
          key={user.username}
          counter={state.counter}
          localCounter={user.localCounter}
          flipped={user.flipped}
          name={user.username}
          activeUser={user.username === state.username}
          previousUser={state.previousUser}
        />
      ))}
    </section>
  );
}

export default Game;
