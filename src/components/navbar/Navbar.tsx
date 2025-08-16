import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './navbar.module.css';
import { useGetCurrentUserQuery, useLogoutUserMutation } from '../../store/api';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import Button from '../button/Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // бургер
  const [generatorOpen, setGeneratorOpen] = useState(false); // выпадашка генератора
  const [userMenuOpen, setUserMenuOpen] = useState(false); // выпадашка пользователя

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith('/profile');

const navbarRef = useRef<HTMLDivElement | null>(null);

  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const { data: user, isLoading: isUserLoading, error: userError } = useGetCurrentUserQuery(undefined);



  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleGenerator = () => {
    setGeneratorOpen(!generatorOpen);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setGeneratorOpen(false);
  };

  const goHome = () => navigate('/');


useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
      setGeneratorOpen(false);
      setUserMenuOpen(false);
      setIsMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);


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
    <div className={styles.wrapper} ref={navbarRef}>
      <header className={styles.header}>
              <div className={styles.leftSide}>
        <img src="/logo.svg" alt="Company Logo" className={styles.logo} onClick={goHome} />

        <button className={styles.menuToggle} onClick={toggleMenu}>
          <span className={`${styles.menuIcon} ${isMenuOpen ? styles.active : ''}`} />
        </button>

        <nav className={`${styles.navigation} ${isMenuOpen ? styles.active : ''}`}>
          {isProfilePage ? (

            
            <>
              {/* Generator */}
              <div className={styles.navItemWrapper}>
                <div
                  className={`${styles.navItemProfile} ${generatorOpen ? styles.active : ''}`}
  onClick={toggleGenerator}
                 >
                  <img src="generator.svg" alt="generator icon" width={28} />
                  <span>Generator</span>
                </div>

                <div
                  className={`${styles.dropdown} ${generatorOpen ? styles.open : ''}`}
                >
                  <div className={styles.dropdownItem} onClick={() => navigate('/profile/create')}>Create</div>
                  <div className={styles.dropdownItem} onClick={() => navigate('/profile/history')}>History</div>
                </div>
              </div>

 <div className={styles.divider}></div>
              {/* Username */}
              <div className={styles.navItemWrapper}>
                <div 
             className={`${styles.navItemProfile} ${userMenuOpen ? styles.active : ''}`}

                onClick={toggleUserMenu}>
                  <img src="username.svg" alt="user icon" width={28}/>
                  <span>{user?.name}</span>
                </div>
                <div
                  className={`${styles.dropdown} ${userMenuOpen ? styles.open : ''}`}
                >
                  <div className={styles.dropdownItem} onClick={() => navigate('/profile/settings')}>Settings</div>
                  <div className={styles.dropdownItem} onClick={() => navigate('/profile/billing')}>Billing</div>
                  <div className={styles.dropdownItem}>
                      <button
                                className={styles.logoutBtn}
                                onClick={handleLogout}
                                disabled={isLoading}
                              >
                                {isLoading ? 'Logging out...' : 'Logout'}
                              </button>
                  </div>
                            
                </div>


          


              </div>
            </>
          ) : (
<>
  <div className={styles.navItem}>
    <img src="main.svg" alt="main icon" width={25} height={20} />
    <span>Main</span>
  </div>
  <div className={styles.divider}></div>
  <div className={styles.navItem}>
    <img src="/pricing.svg" alt="pricing icon" width={25} height={20} />
    <span>Pricing</span>
  </div>
  <div className={styles.divider}></div>
  <div className={styles.navItem}>
    <img src="help.svg" alt="help icon" width={16} height={22} />
    <span>Help</span>
  </div>
  <div className={styles.divider}></div>
  <div className={styles.navItem}>
    <img src="about.svg" alt="about icon" width={21} height={16} />
    <span>About</span>
  </div>



      


</>
          )}
        </nav>

</div>
      <div className={styles.rightSide}>

<div className={styles.money}> 
    <img src="/coin.svg" alt="" />
  <p>10.000</p>
</div>


<Button
  text="Top up"
  size="small"
/> 
</div>




      </header>
    </div>
  );
};

export default Navbar;
