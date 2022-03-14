import { useEffect, useState } from "react";

import styles from "./snackbar.module.scss";

function Snackbar({ message }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  }, []);
  return (
    <div className={isVisible ? styles.visible : styles.hidden}>{message}</div>
  );
}

export default Snackbar;
