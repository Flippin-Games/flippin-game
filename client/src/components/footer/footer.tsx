import styles from "./footer.module.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.col}>
        <a
          href="https://drive.google.com/drive/folders/1pGIcpZVsK-g0MEEoQO-icj5EVoQBByK8?usp=sharing"
          target="_blank"
        >
          Facilitation Guide
        </a>
        <a
          href="https://www.paypal.com/donate/?hosted_button_id=XKHQ46HFVQ7LE"
          target="_blank"
        >
          Donate
        </a>
      </div>

      <div className={styles.contact}>
        Contact us:{" "}
        <a href="mailto:flippinsupport@flippingames.com">
          flippinsupport@flippingames.com
        </a>
      </div>
    </footer>
  );
}

export default Footer;
