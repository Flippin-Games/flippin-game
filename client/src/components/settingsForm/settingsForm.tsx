import Form from "../form/form";
import FormField from "../form/formField/formField";

import styles from "./settingsForm.module.scss";

function SettingsForm(props: any) {
  return (
    <section className={styles.wrapper}>
      <Form onSubmit={props.handleStartGame} errorMessage="">
        <FormField
          id="batchSize"
          type="number"
          value={props.formValues.batchSize}
          onChange={props.handleChange}
          label="Enter batch size"
          placeholder=""
          required
          row={true}
        />
        <FormField
          id="amountOfBatches"
          type="number"
          value={props.formValues.amountOfBatches}
          onChange={props.handleChange}
          label="Enter amount of batches"
          placeholder=""
          required
          row={true}
        />
        <FormField
          id="autoMoveCoins"
          type="checkbox"
          checked={props.formValues.autoMoveCoins}
          onChange={props.handleChange}
          label="Auto move coins to next user"
          placeholder=""
          required={false}
          row={true}
        />
        <button
          type="submit"
          disabled={props.started}
          className="btn btn-primary"
        >
          Start Game
        </button>
      </Form>
    </section>
  );
}

export default SettingsForm;
