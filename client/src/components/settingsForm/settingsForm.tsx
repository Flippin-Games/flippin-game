import Button from "../button/button";
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
          label="Batch size"
          placeholder=""
          required
          row={true}
        />
        <FormField
          id="amountOfBatches"
          type="number"
          value={props.formValues.amountOfBatches}
          onChange={props.handleChange}
          label="Amount of batches"
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
        <Button
          type="submit"
          disabled={props.isPlaying}
          className="btn btn-primary"
          disabledText="Game in progress..."
          text="Give coins"
        />
      </Form>
    </section>
  );
}

export default SettingsForm;
