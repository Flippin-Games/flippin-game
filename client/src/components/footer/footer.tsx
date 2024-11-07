import styles from "./footer.module.scss";
import RedTangerineIcon from "../../assets/imgs/RedTangerineLogo.png";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        <div className={styles.footer__nav}>
          <div className={styles.col}>
            <a
              href="https://docs.google.com/document/d/1-_pGMtmaqAoKhFu1Dl_CBBx69G72370g2aFWAaKC5u0?usp=sharing"
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

          <div>
            <a href="https://www.redtangerine.org" target="_blank">
              <img src={RedTangerineIcon}  className={styles.logo} alt="Red Tangerine Logo"/>
            </a>
          </div> 

          <div className={styles.contact}>
            Contact us:{" "}
            <a href="mailto:info@redtangerine.org">
              info@redtangerine.org
            </a>
          </div>
        </div>

        <div>
          <p className={styles.copyright}>
            Copyright @ 2024 Red Tangerine. All Rights Reserved.
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
