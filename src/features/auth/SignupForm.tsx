import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterUserMutation } from '../../store/api';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/errorHandler';
import Button from '../../components/button/Button';
import styles from './signUp.module.css'
import { useNavigate } from 'react-router-dom';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { z } from 'zod';


const signupSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    repeatPassword: z.string().min(8, 'Passwords must match'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the terms' }),
    }),
    subscribe: z.boolean(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const [registerUser, { isLoading, isError, error }] = useRegisterUserMutation();
    const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
      terms: false,
      subscribe: true,
    },
  });

const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
  try {
    const result = await registerUser({
      name: data.username,
      email: data.email,
      password: data.password,
      mailing_agree: data.subscribe ? 1 : 0,
    }).unwrap();

    toast.success(result || 'Registration successful!');
  } catch (err) {
    const typedError = err as FetchBaseQueryError | SerializedError;

    const status =
      'originalStatus' in typedError
        ? typedError.originalStatus
        : 'status' in typedError
        ? typedError.status
        : undefined;

    const errorMessage =
      status === 409
        ? 'Email or username already exists.'
        : status === 500
        ? 'Internal server error. Please try again later.'
        : getErrorMessage(typedError);

    toast.error(`Registration failed: ${errorMessage}`);
  }
};

     const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className={styles.signUpPage}>
      <main className={styles.mainContent}>
        <div className={styles.contentGrid}>
          <section className={styles.leftColumn}>
            <h1 className={styles.pageTitle}>Sign UP</h1>
            <p className={styles.titleSubtext}>and let your creativity run wild</p>

            <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.inputField}>
                <input
                  {...register('username')}
                  type="text"
                  placeholder="user name*"
                  aria-describedby="username-warning"
                />
              </div>
              <p id="username-warning" className={styles.usernameWarning}>
                *it won't be possible to change the username later
              </p>
              {errors.username && <p className={styles.error}>{errors.username.message}</p>}

              <div className={styles.inputField}>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="your email"
                />
              </div>
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}

              <div className={styles.inputField}>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="password"
                  aria-describedby="password-requirement"
                />
              </div>
              {errors.password && <p className={styles.error}>{errors.password.message}</p>}

              <div className={styles.inputField}>
                <input
                  {...register('repeatPassword')}
                  type="password"
                  placeholder="repeat password"
                />
              </div>
              <p id="password-requirement" className={styles.usernameWarning}>
                Password must be 8+ characters
              </p>
              {errors.repeatPassword && <p className={styles.error}>{errors.repeatPassword.message}</p>}

              <div className={styles.agreementSection}>
                <label className={styles.checkboxRow}>
                  <input type="checkbox" {...register('terms')} className={styles.checkbox} />
                  <span className={styles.termsText}>
                    I agree to EPX <span className={styles.linkText}>Terms of use</span> and{' '}
                    <span className={styles.linkText}>Privacy statement</span>.
                  </span>
                </label>
                {errors.terms && <p className={styles.errorCheckbox}>{errors.terms.message}</p>}

                <label className={styles.checkboxRow}>
                  <input type="checkbox" {...register('subscribe')} className={styles.checkbox} />
                  <span className={styles.subscriptionText}>Subscribe to EPX news.</span>
                </label>
              </div>

              <Button
                text={isLoading ? 'Signing up...' : 'Sign up'}
                disabled={isLoading}
               type="submit"
              />

              {isError && <p className={styles.error}>Registration failed: {getErrorMessage(error)}</p>}

          
            </form>
             
    <p className={styles.signInLink}>
                Already have an account?{" "}
                <span className={styles.linkText} onClick={handleSignIn}>
                  Sign in
                </span>
              </p>

          </section>

          <div className={styles.rightColumn}>
            <img
            //   src="/green.png"
                          src="https://api.builder.io/api/v1/image/assets/TEMP/9adef6669ce69887fbd535bd5c6bb434c8b935f8?placeholderIfAbsent=true&apiKey=74db10a95f1e4e92821d917887146420"

              alt="Decorative illustration"
              className={styles.decorativeImage}
            />
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default SignupForm;
