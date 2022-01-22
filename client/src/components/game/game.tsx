import { memo } from "react";

import PlayerCard from "../playerCard/playerCard";

import styles from "./game.module.scss";

function Game({ counter, users, previousUser, username }: any) {
  console.log("GAME RERENDER");
  return (
    <section className={styles.wrapper}>
      {users?.map((user: any) => (
        <PlayerCard
          key={user.username}
          counter={counter}
          localCounter={user.localCounter}
          flipped={user.flipped}
          name={user.username}
          activeUser={user.username === username}
          previousUser={previousUser}
        />
      ))}
    </section>
  );
}

export default memo(Game);
