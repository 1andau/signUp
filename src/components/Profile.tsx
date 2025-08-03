import { useLogoutUserMutation } from '../store/api';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout()); // очищаем Redux
      localStorage.removeItem('accessToken'); 
      navigate('/'); // редирект
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <div>
      <h1>Welcome, eew32323!</h1>
      <p>Email: iamsarahlandau@yahoo.com</p>
      <p>User ID: eaf6320d-14fe-4d9d-b9b5-487b3e959160</p>
      <button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
};

export default Profile;
