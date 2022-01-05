import styles from "./formField.module.scss";

interface IFormField {
  id: string;
  placeholder: string;
  value?: string | number;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type: string;
  required: boolean;
  checked?: boolean;
}

function FormField(props: IFormField) {
  return (
    <fieldset className={styles.formField}>
      <label className={styles.label} htmlFor={props.id}>
        {props.label}
      </label>
      {props.type === "checkbox" ? (
        <input
          id={props.id}
          name={props.id}
          placeholder={props.placeholder}
          onChange={props.onChange}
          type={props.type}
          required={props.required}
          className={styles.input}
          checked={props.checked}
        />
      ) : (
        <input
          id={props.id}
          name={props.id}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          type={props.type}
          required={props.required}
          className={styles.input}
          min="0"
        />
      )}
    </fieldset>
  );
}

export default FormField;
