import Button from "../button/button";

import styles from "./usersList.module.scss";

// TODO fix any
function UsersList({ users, handleRemove }: any) {
  return (
    <section>
      <h2>Players in current game</h2>
      {users && (
        // TODO fix any
        <ol>
          {users.length ? (
            users.map((user: any) => (
              <li key={user.username}>
                <div className={styles.item}>
                  {user.username}
                  <Button
                    type="button"
                    dataAtrr={user.username}
                    onClick={handleRemove}
                    className="btn btn-primary btn-s"
                    text="Remove"
                  />
                </div>
              </li>
            ))
          ) : (
            <li>No players logged in...</li>
          )}
        </ol>
      )}
    </section>
  );
}

export default UsersList;
