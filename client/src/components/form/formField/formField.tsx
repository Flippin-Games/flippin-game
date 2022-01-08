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
  row?: boolean;
}

function FormField({
  id,
  placeholder,
  value,
  label,
  onChange,
  type,
  required,
  checked,
  row,
}: IFormField) {
  return (
    <fieldset
      className={`${styles.formField} ${row ? styles.row : ""} ${
        type === "checkbox" ? styles.checkbox : ""
      }`}
    >
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {type === "checkbox" ? (
        <>
          <input
            id={id}
            name={id}
            placeholder={placeholder}
            onChange={onChange}
            type={type}
            required={required}
            className={styles.input}
            checked={checked}
          />
          <span className={styles.checkmark} />
        </>
      ) : (
        <input
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          type={type}
          required={required}
          className={styles.input}
          min="0"
        />
      )}
    </fieldset>
  );
}

export default FormField;
