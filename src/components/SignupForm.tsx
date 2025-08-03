import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRegisterUserMutation } from '../store/api';
import { toast } from 'react-toastify';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getErrorMessage } from '../utils/errorHandler';
import '../styles/signupForm.scss';
import Button from './button/Button';
import styles from '../styles/signUp.module.css'

const signupSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    repeatPassword: z.string().min(8, 'Passwords must match'),
    terms: z.boolean(),
    subscribe: z.boolean(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  })
  .refine((data) => data.terms === true, {
    message: 'You must agree to the terms',
    path: ['terms'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const [registerUser, { isLoading, isError, error }] = useRegisterUserMutation();
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
        mailing_agree: data.subscribe,
      }).unwrap();
      toast.success(result.message || 'Registration successful! Please check your email to verify.');
      console.log('Registration response:', result);
    } catch (err: any) {
      const status = 'originalStatus' in err ? err.originalStatus : err.status;
      let errorMessage = 'Server error (check CORS or API)';
      if (status === 409) {
        errorMessage = 'Email or username already exists.';
      } else if (status === 500) {
        errorMessage = 'Internal server error. Please try again later.';
      } else {
        errorMessage = getErrorMessage(err);
      }
      toast.error(`Registration failed: ${errorMessage}`);
      console.error('Registration error:', err);
    }
  };

  return (



    <div className={styles.signUpPage}>
      <main className={styles.mainContent}>
        <div className={styles.contentGrid}>
          <div className={styles.leftColumn}>
            <section className={styles.formSection}>
        

<h1 className={styles.pageTitle}>Sign UP</h1>
  <div className={styles.titleSubtext}>and let your creativity run wild</div>


              <div className={styles.formContainer}>
            <form className={styles.inputsContainer} onSubmit={handleSubmit(onSubmit)} >

                  <div className={styles.inputField}>
                  
                    <input
                    {...register('username')}
                      type="text"
                      id="username"
                      name="username"
                      placeholder="user name*"
                      required
                      aria-describedby="username-warning"
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%' }}
                    />


                  </div>
                                   <p id="username-warning" className={styles.usernameWarning}>
          *it won't be possible to change the username later
        </p>

            {errors.username && <p className={styles.error}>{errors.username.message}</p>}

                  <div className={styles.inputFieldSpaced}>
                    <input
                    {...register('email')}
                      type="email"
                      placeholder='your email'
                      id="email"
                      name="email"
                      required
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%' }}
                    />
                  </div>
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}


                  <div className={styles.inputFieldNoWrap}>
                    <input
                    {...register('password')}
                      type="password"
                      id="password"
                      placeholder='password'
                      name="password"
                      required
                      aria-describedby="password-requirement"
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%' }}
                    />
                  </div>
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}

                  <div className={styles.inputFieldSpaced}>
                    <input
                    {...register('repeatPassword')}
                      id="repeatPassword"
                      placeholder='repeat password'
                      required
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '100%' }}
                    />
                  </div>
                    <p id="password-requirement" className={styles.usernameWarning}>
                  Password must be 8+ characters
                </p>

            {errors.repeatPassword && <p className={styles.error}>{errors.repeatPassword.message}</p>}





                <div className={styles.agreementSection}>
                  <div className={styles.checkboxRow}>
         <input
  type="checkbox"
  id="terms"
  {...register('terms')}
  className={styles.checkbox}
/>
                    <label htmlFor="terms" className={styles.termsText}>
                      I agree to EPX{" "}
                      <span className={styles.linkText}>
                        Terms of use
                      </span>{" "}
                      and{" "}
                      <span className={styles.linkText}>
                        Privacy statement
                      </span>
                      .
                    </label>
                  </div>

                  <div className={styles.subscriptionRow}>

               <input
  type="checkbox"
  id="subscribe"
  {...register('subscribe')}
  className={styles.checkbox}
/>
             
                    <label className={styles.subscriptionText}>
                      Subscribe to EPX news.
                    </label>

                    
                  </div>
            {errors.terms && <p className={styles.errorCheckbox}>{errors.terms.message}</p>}


<Button
            text={isLoading ? 'Signing up...' : 'Sign up'}
            onClick={handleSubmit(onSubmit)} 
            disabled={isLoading}
          />



 {isError && <p className={styles.error}>Registration failed: {getErrorMessage(error)}</p>}
          

                </div>



                </form>

              


              </div>

              <p className={styles.signInLink}>
                Already have an account?{" "}
                <span className={styles.linkText}>
                  Sign in
                </span>
              </p>
            </section>
          </div>

          <div className={styles.rightColumn}>
            <img
            src='/green.png'
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