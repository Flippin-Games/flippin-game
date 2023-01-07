import styles from "./header.module.scss";

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>The Flippin' Game!</h1>
    </header>
  );
}

export default Header;
