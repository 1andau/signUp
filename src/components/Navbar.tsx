import styles from './navbar.module.css'

const Navbar = () => {
  return (
 <header className={styles.header}>      
      <div className={styles.signUpTab}>

      <div className={styles.signInButton}>
        <span>Sign in</span>
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/0f6e22742a993fc0cfcd9191c845bd890a2fec9b?placeholderIfAbsent=true&apiKey=74db10a95f1e4e92821d917887146420"
          alt="Sign in icon"
          className={styles.signInIcon}
        />
      </div>

      </div>


        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f55c48559d978d619083587577494d1146f08387?placeholderIfAbsent=true&apiKey=74db10a95f1e4e92821d917887146420"
          alt="Company Logo"
          className={styles.logo}
        />

      <nav className={styles.navigation}>
        <div className={styles.navItem}>
          <div className={styles.mainButton}>
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/77f6e95b4047d8723f33f7bbb146a63b7f9c0467?width=50" alt="main icon" width={25} height={20} />
            <span>Main</span>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.navItem}>
          <div className={styles.pricingButton}>
            <div className={styles.pricingIcons}>
              <div className={styles.iconCircle} style={{backgroundColor: '#1A848E'}}></div>
              <div className={styles.iconCircle} style={{backgroundColor: '#6DE8CA'}}></div>
              <div className={styles.iconCircle} style={{backgroundColor: '#F0F0F0'}}></div>
            </div>
            <span>Pricing</span>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.navItem}>
          <img src="https://api.builder.io/api/v1/image/assets/TEMP/e96e83643fd12bd3888643f4a48e937747a87005?width=32" alt="help icon" width={16} height={22} />
          <span>Help</span>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.navItem}>
          <img src="https://api.builder.io/api/v1/image/assets/TEMP/35bf5a6d296327876442ca23f5f029be0378bd12?width=42" alt="about icon" width={21} height={16} />
          <span>About</span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
