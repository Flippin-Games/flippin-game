import styles from "./form.module.scss";

interface IForm {
  children: React.ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  errorMessage: string;
}

function Form(props: IForm) {
  return (
    <form className={styles.form} onSubmit={props.onSubmit}>
      {props.errorMessage.length > 0 ? (
        <div className={styles.error} aria-live="polite">
          {props.errorMessage}
        </div>
      ) : null}
      {props.children}
    </form>
  );
}

export default Form;
