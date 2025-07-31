import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRegisterUserMutation } from '../store/api';
import { toast } from 'react-toastify';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getErrorMessage } from '../utils/errorHandler';
import '../styles/signupForm.scss'
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
    <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
      <h2>SIGN UP</h2>
      <p>AND LET YOUR CREATIVITY RUN WILD</p>
      <div>
        <label>user name*</label>
        <input {...register('username')} placeholder="user name" />
        {errors.username && <p className="error">{errors.username.message}</p>}
        <small>it won't be possible to change the username later</small>
      </div>
      <div>
        <label>your email</label>
        <input {...register('email')} type="email" placeholder="your email" />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>
      <div>
        <label>password</label>
        <input {...register('password')} type="password" placeholder="password" />
        {errors.password && <p className="error">{errors.password.message}</p>}
        <small>Password must be 8+ characters</small>
      </div>
      <div>
        <label>repeat password</label>
        <input {...register('repeatPassword')} type="password" placeholder="repeat password" />
        {errors.repeatPassword && <p className="error">{errors.repeatPassword.message}</p>}
      </div>
      <div>
        <input type="checkbox" {...register('terms')} />
        <label>I agree to EPX Terms of use and Privacy statement.</label>
        {errors.terms && <p className="error">{errors.terms.message}</p>}
      </div>
      <div>
        <input type="checkbox" {...register('subscribe')} defaultChecked />
        <label>Subscribe to EPX news.</label>
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing up...' : 'Sign up'}
      </button>
      {isError && <p className="error">Registration failed: {getErrorMessage(error)}</p>}
      <p>Already have an account? <a href="/login">Sign in</a></p>
    </form>
  );
};

export default SignupForm;