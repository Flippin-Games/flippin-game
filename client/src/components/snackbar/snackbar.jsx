import { useEffect, useState } from "react";

import styles from "./snackbar.module.scss";

function Snackbar({ message }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    console.log("hello");
    setTimeout(() => {
      console.log("in");
      setIsVisible(false);
    }, 5000);
  }, []);
  return (
    <div className={isVisible ? styles.visible : styles.hidden}>{message}</div>
  );
}

export default Snackbar;
