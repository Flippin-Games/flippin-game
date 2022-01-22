type ButtonProps = {
  type: "button" | "submit" | "reset" | undefined;
  className: string;
  text: string;
  onClick?: any; // TODO
  disabled?: boolean;
  disabledText?: string;
  dataAtrr?: string;
};

function Button({
  type,
  onClick,
  className,
  text,
  disabled,
  dataAtrr,
  disabledText,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${className}`}
      disabled={disabled}
      data-attr={dataAtrr}
    >
      {!disabled ? text : disabledText}
    </button>
  );
}

export default Button;
