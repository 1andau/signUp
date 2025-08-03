import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLoginUserMutation } from '../store/api';
import { toast } from 'react-toastify';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getErrorMessage } from '../utils/errorHandler';
import SHA256 from 'crypto-js/sha256';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';


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

const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
  const hashedPassword = SHA256(data.password_hash).toString(); // Хешируем пароль

  try {
    const result = await loginUser({
      username: data.username,
      password_hash: hashedPassword,
    }).unwrap();

    localStorage.setItem('accessToken', result.access); // сохраняем токен
    dispatch(setToken(result.access)); // кладём в Redux
    toast.success('Login successful!');
    console.log('Login response:', result);
     navigate('/profile');

  } catch (err: any) {
    const status = err?.originalStatus || err?.status;
    let errorMessage = 'Login failed';

    if (status === 401) {
      errorMessage = 'Invalid credentials';
    } else if (status === 404) {
      errorMessage = 'User not found';
    } else if (status === 422) {
      const fetchError = err as FetchBaseQueryError;
      errorMessage =
        fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data
          ? (fetchError.data as ApiError).message
          : 'Validation error';
    } else if (status === 500) {
      errorMessage = 'Server error. Please try again later';
    }

    toast.error(`Login failed: ${errorMessage}`);
    console.error('Login error:', err);
  }
};


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      <h2>LOG IN</h2>
      <div>
        <label>Username</label>
        <input {...register('username')} placeholder="Enter username" />
        {errors.username && <p className="error">{errors.username.message}</p>}
      </div>
      <div>
        <label>Password</label>
        <input {...register('password_hash')} type="password" placeholder="Enter password" />
        {errors.password_hash && <p className="error">{errors.password_hash.message}</p>}
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log in'}
      </button>
            {isError && <p className="error">Login failed: {getErrorMessage(error)}</p>}

      <p>Don’t have an account? <a href="/">Sign up</a></p>
    </form>
  );
};

export default LoginForm;