import { useGetCurrentUserQuery, useLogoutUserMutation } from '../../store/api';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './profile.module.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const { data: user, isLoading: isUserLoading, error: userError } = useGetCurrentUserQuery(undefined);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      localStorage.removeItem('accessToken');
      localStorage.removeItem('csrfToken')
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

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
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
          </section>
        </main>
      ) : null}
    </div>
  );
};

export default Profile;