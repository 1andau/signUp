import { Link } from "react-router-dom";
import styles from './notFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>OOOOOOPS, 404</h1>
      <p className={styles.message}> Sorry but this page doesnt exist </p>
      <Link className={styles.link} to="/">Back to sign up page</Link>
    </div>
  );
};

export default NotFound;