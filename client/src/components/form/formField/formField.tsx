import styles from "./formField.module.scss";

interface IFormField {
  id: string;
  placeholder: string;
  value: string;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type: string;
  required: boolean;
}

function FormField(props: IFormField) {
  return (
    <fieldset className={styles.formField}>
      <label className={styles.label} htmlFor={props.id}>
        {props.label}
      </label>
      <input
        id={props.id}
        name={props.id}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        type={props.type}
        required={props.required}
        className={styles.input}
      />
    </fieldset>
  );
}

export default FormField;
