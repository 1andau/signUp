import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLazyGetCsrfTokenQuery, useLoginUserMutation } from '../../store/api';
import { toast } from 'react-toastify';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getErrorMessage } from '../../utils/errorHandler';
import SHA256 from 'crypto-js/sha256';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './signUp.module.css';
import Button from '../../components/button/Button';
import { SerializedError } from '@reduxjs/toolkit';

interface ApiError {
  message: string;
}

interface LoginFormData {
  username: string;
  password_hash: string;
}

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password_hash: z.string().min(1, 'Password is required'),
});

const LoginForm = () => {
  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

const [getCsrfToken] = useLazyGetCsrfTokenQuery();


const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
  const hashedPassword = SHA256(data.password_hash).toString();

  try {
    const csrfData = await getCsrfToken().unwrap();
    localStorage.setItem('csrfToken', csrfData.token);

    const result = await loginUser({
      username: data.username,
      password_hash: hashedPassword,
    }).unwrap();

    localStorage.setItem('accessToken', result.access);
    dispatch(setToken(result.access));
    toast.success('Login successful!');
    navigate('/profile');

  } catch (err) {
    const typedError = err as FetchBaseQueryError | SerializedError;
    const status =
      'originalStatus' in typedError
        ? typedError.originalStatus
        : 'status' in typedError
        ? typedError.status
        : undefined;

    let errorMessage = 'Login failed';

    if (status === 401) {
      errorMessage = 'Invalid credentials';
    } else if (status === 404) {
      errorMessage = 'User not found';
    } else if (status === 422) {
      if ('status' in typedError && typedError.status === 422) {
        const fetchError = typedError as FetchBaseQueryError;
        errorMessage =
          fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
            ? (fetchError.data as ApiError).message
            : 'Validation error';
      }
    } else if (status === 500) {
      errorMessage = 'Server error. Please try again later';
    }

    toast.error(`Login failed: ${errorMessage}`);
    console.error('Login error:', typedError);
  }
};
       const handleSignUp = () => {
    navigate('/');
  };

  return (
    <div className={styles.signUpPage}>
      <main className={styles.mainContent}>
        <div className={styles.contentGrid}>
          <section className={styles.leftColumn}>
            <h1 className={styles.pageTitle}>Log in</h1>
            <p className={styles.titleSubtext}>to unleash your creativity</p>

            <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.inputField}>
                <input
                  {...register('username')}
                  type="text"
                  placeholder="Username"
                  aria-describedby="username-warning"
                />
              </div>
              {errors.username && <p className={styles.error}>{errors.username.message}</p>}

              <div className={styles.inputField}>
                <input
                  {...register('password_hash')}
                  type="password"
                  placeholder="Password"
                  aria-describedby="password-requirement"
                />
              </div>
              {errors.password_hash && <p className={styles.error}>{errors.password_hash.message}</p>}

              <Button
                text={isLoading ? 'Logging in...' : 'Log in'}
                type="submit"
               disabled={isLoading}
              />

              {isError && <p className={styles.error}>Login failed: {getErrorMessage(error)}</p>}
            </form>

            <p className={styles.signInLink}>
              Don’t have an account?{' '}
              <span className={styles.linkText} onClick={handleSignUp}>Sign up</span>
            </p>
          </section>

          <div className={styles.rightColumn}>
            <img
              src="/gold.png"
              alt="Decorative illustration"
              className={styles.decorativeImage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginForm;