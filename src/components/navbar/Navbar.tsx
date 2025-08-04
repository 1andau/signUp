import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthClick = () => {
    if (location.pathname === '/') {
      navigate('/login');
    } else {
      navigate('/');
    }
  };

  const buttonText = location.pathname === '/' ? 'Sign in' : 'Sign up';
  const buttonIconSrc =
    location.pathname === '/'
      ? 'https://api.builder.io/api/v1/image/assets/TEMP/0f6e22742a993fc0cfcd9191c845bd890a2fec9b?placeholderIfAbsent=true&apiKey=74db10a95f1e4e92821d917887146420'
      : 'https://api.builder.io/api/v1/image/assets/TEMP/0f6e22742a993fc0cfcd9191c845bd890a2fec9b?placeholderIfAbsent=true&apiKey=74db10a95f1e4e92821d917887146420'; 

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <img src="/logo.svg" alt="Company Logo" className={styles.logo} />

        <button className={styles.menuToggle} onClick={toggleMenu}>
          <span className={`${styles.menuIcon} ${isMenuOpen ? styles.active : ''}`}></span>
        </button>

        <nav className={`${styles.navigation} ${isMenuOpen ? styles.active : ''}`}>
          <div className={styles.navItem}>
            <img src="main.svg" alt="main icon" width={25} height={20} />
            <span>Main</span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.navItem}>
            <img src="/pricing.svg" alt="main icon" width={25} height={20} />
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
        </nav>
      </header>

      <div className={styles.signUpTab}>
        <button className={styles.signInButton} onClick={handleAuthClick}>
          <span>{buttonText}</span>
          <img
            src={buttonIconSrc}
            alt={`${buttonText} icon`}
            className={styles.signInIcon}
          />
        </button>
      </div>
    </div>
  );
};

export default Navbar;