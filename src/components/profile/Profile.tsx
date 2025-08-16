import { useGetCurrentUserQuery, useLogoutUserMutation } from "../../store/api";
import Button from "../button/Button";
import styles from "./profile.module.css";

const Profile = () => {
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useGetCurrentUserQuery(undefined);

  return (
<div className={styles.settings}>
  <div className={styles.header}>
    <div className={styles.usernameDiv}>
      <img src="/profilePic.svg" alt="Profile" />
      <div className={styles.username}>{user?.name || '[username]'}</div>
    </div>
    <div className={styles.settingsHeader}>Settings</div>
  </div>

  <div className={styles.formContainer}>
    <div className={styles.emailSection}>
      <div className={styles.inputField}>
        <input type="email" placeholder="Email" />
        <img src="/pencil.svg" className={styles.pencilIcon} alt="Edit" />
      </div>
      <div className={styles.emailInfo}>
        You can change your current email address and we will send you a confirmation letter.
      </div>
    </div>

    <div className={styles.inputField}>
      <input type="password" placeholder="Current password" />
    </div>

    <div className={styles.inputField}>
      <input type="password" placeholder="New password" />
    </div>

    <div className={styles.inputField}>
      <input type="password" placeholder="Confirm new password" />
    </div>

    <div className={styles.passwordRequirements}>
      <span>*New password must contain at least:</span>
      <ul>
        <li>10 characters</li>
        <li>One uppercase letter</li>
        <li>One number</li>
        <li>One special character (e.g., @, #, $, %, &, *)</li>
      </ul>
    </div>

    <Button text="Save" size="small" />
  </div>
</div>

  );
};

export default Profile;
