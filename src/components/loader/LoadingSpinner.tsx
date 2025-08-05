import styles from './LoadingSpinner.module.css'

const LoadingSpinner = () => {
  return (
    <div className={styles.containerForSpinner}>
      <div className={styles.spinner} />
      <p className={styles.spinnerText}>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;