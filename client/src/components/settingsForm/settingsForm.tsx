import Form from "../form/form";
import FormField from "../form/formField/formField";

function SettingsForm(props: any) {
  return (
    <Form onSubmit={props.handleStartGame} errorMessage="">
      <FormField
        id="startAmount"
        type="number"
        value={props.formValues.startAmount}
        onChange={props.handleChange}
        label="Enter start amount of coins"
        placeholder=""
        required
      />
      <FormField
        id="batchSize"
        type="number"
        value={props.formValues.batchSize}
        onChange={props.handleChange}
        label="Enter start batch size"
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
