import styles from './button.module.css';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const Button = ({ text, className, ...rest }: ButtonProps) => {
  return (
    <button
      className={`${styles.signUpButton} ${className ?? ''}`}
      aria-label={text}
      {...rest}
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
