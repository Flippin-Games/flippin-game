import Form from "../form/form";
import FormField from "../form/formField/formField";

function SettingsForm(props: any) {
  return (
    <Form onSubmit={props.handleStartGame} errorMessage="">
      <FormField
        id="batchSize"
        type="number"
        value={props.formValues.batchSize}
        onChange={props.handleChange}
        label="Enter batch size"
        placeholder=""
        required
      />
      <FormField
        id="amountOfBatches"
        type="number"
        value={props.formValues.amountOfBatches}
        onChange={props.handleChange}
        label="Enter amount of batches"
        placeholder=""
        required
      />
      <FormField
        id="autoMoveCoins"
        type="checkbox"
        checked={props.formValues.autoMoveCoins}
        onChange={props.handleChange}
        label="Auto move coins to next user"
        placeholder=""
        required={false}
      />
      <button
        type="submit"
        disabled={props.started}
        className="btn btn-primary"
      >
        Start Game
      </button>
    </Form>
  );
}

export default SettingsForm;
