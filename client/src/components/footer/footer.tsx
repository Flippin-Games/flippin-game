import styles from "./footer.module.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        <div className={styles.footer__nav}>
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
        </div>

        <div>
          <p className={styles.copyright}>
            Copyright @ 2022 - Flippingames.com
          </p>
          <p className={styles.note}>
            Built with ❤️ by{" "}
            <a href="https://weronika.dev" target="_blank">
              weronika.dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
