import { useGetCurrentUserQuery, useLogoutUserMutation } from '../../store/api';
import styles from './profile.module.css';

const Profile = () => {
  const { data: user, isLoading: isUserLoading, error: userError } = useGetCurrentUserQuery(undefined);

  return (
    <div className={styles.profilePage}>
      {isUserLoading ? (
        <p className={styles.loading}>Loading user data...</p>
      ) : userError ? (
        <p className={styles.error}>Error fetching user data</p>
      ) : user ? (
        <main className={styles.mainContent}>
          <section className={styles.profileSection}>
            <h1 className={styles.pageTitle}>Welcome, {user.name}!</h1>
            <div className={styles.infoContainer}>
              <p className={styles.infoItem}>Email: {user.email}</p>
              <p className={styles.infoItem}>User ID: {user.id}</p>
            </div>
  
          </section>
        </main>
      ) : null}
    </div>
  );
};

export default Profile;