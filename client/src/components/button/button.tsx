type ButtonProps = {
  type: "button" | "submit" | "reset" | undefined;
  className: string;
  text: string;
  onClick?: any; // TODO
  disabled?: boolean;
  dataAtrr?: string;
};

function Button({
  type,
  onClick,
  className,
  text,
  disabled,
  dataAtrr,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${className}`}
      disabled={disabled}
      data-attr={dataAtrr}
    >
      {text}
    </button>
  );
}

export default Button;
