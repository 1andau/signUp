// src/components/ConfirmEmail.tsx
import { useParams } from 'react-router-dom';
import { useConfirmEmailMutation, useGetCsrfTokenQuery } from '../store/api';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ConfirmEmail = () => {
  const { token } = useParams<{ token: string }>();
  const { data: csrfToken } = useGetCsrfTokenQuery({}); // Получаем CSRF
  const [confirmEmail, { isLoading, isError, error, isSuccess, data }] = useConfirmEmailMutation();

  useEffect(() => {
    if (token && csrfToken) {
      localStorage.setItem('csrfToken', csrfToken as string); // Сохраняем
      confirmEmail(token)
        .unwrap()
        .then((response) => {
          console.log('Confirmation response:', response);
          toast.success(`Email confirmed successfully! ${response || ''}`);
        })
        .catch((err) => {
          console.error('Confirmation error details:', err);
          const message = err.data?.message || (err.status === 400 ? 'Invalid or expired token' : err.status === 404 ? 'User not found' : err.status === 409 ? 'User already registered' : err.status === 422 ? 'Validation error' : err.status === 424 ? 'Blockchain account creation failed' : 'Server error');
          toast.error(`Confirmation failed: ${message}`);
        });
    }
  }, [token, csrfToken, confirmEmail]);

  if (isLoading) return <div>Confirming email...</div>;
  if (isError) return <div>Error: {error && typeof error === 'object' && 'data' in error ? (error as any).data?.message : 'Server error'}</div>;
  if (isSuccess) return <div>Email confirmed! Redirecting to login... <a href="/login">Go to Login</a></div>;

  return <div>Fetching CSRF token...</div>;
};

export default ConfirmEmail;