import * as React from "react";
import styles from "./button.module.css";

interface ButtonProps {
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <button
      className={styles.signUpButton}
      aria-label={text}
      type="submit" // Изменил на submit для работы с формой
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles.buttonBackground} />
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/67ecc46efec5a848f54a109d64b23a1b0060fcfd?width=880"
        alt={`${text} button decoration`}
        className={styles.buttonOverlay}
      />
      <span className={styles.buttonText}>{text}</span>
    </button>
  );
};

export default Button;