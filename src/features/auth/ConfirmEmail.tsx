import { useParams, useNavigate } from 'react-router-dom';
import { useConfirmEmailMutation, useGetCsrfTokenQuery } from '../../store/api';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { isFetchBaseQueryError } from '../../utils/errorHandler';
import { CsrfResponse } from '../../components/types';



const ConfirmEmail = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const { data: csrfData } = useGetCsrfTokenQuery();


  const [confirmEmail, { isLoading, isError, error, isSuccess }] = useConfirmEmailMutation();

  useEffect(() => {
    if (csrfData && token) {
      const csrfToken = (csrfData as CsrfResponse).csrfToken;
      localStorage.setItem('csrfToken', csrfToken);

      confirmEmail(token)
        .unwrap()
        .then(() => {
          toast.success('Email confirmed successfully!');
          setTimeout(() => navigate('/login'), 2000);
        })
        .catch((err: unknown) => {
          console.error('Confirmation error details:', err);

          let message = 'Server error';

          if (
            isFetchBaseQueryError(err) &&
            err.data &&
            typeof err.data === 'object' &&
            'message' in err.data
          ) {
            message = (err.data as { message: string }).message;
          } else if (isFetchBaseQueryError(err)) {
            switch (err.status) {
              case 400:
                message = 'Invalid or expired token';
                break;
              case 404:
                message = 'User not found';
                break;
              case 409:
                message = 'User already registered';
                break;
              case 422:
                message = 'Validation error';
                break;
              case 424:
                message = 'Blockchain account creation failed';
                break;
              default:
                message = 'Server error';
            }
          }

          toast.error(`Confirmation failed: ${message}`);
        });
    }
  }, [csrfData, token, confirmEmail, navigate]);

  if (isLoading) return <div>Confirming email...</div>;

  if (isError) {
    let message = 'Server error';
    if (
      isFetchBaseQueryError(error) &&
      error.data &&
      typeof error.data === 'object' &&
      'message' in error.data
    ) {
      message = (error.data as { message: string }).message;
    }

    return <div>Error: {message}</div>;
  }

  if (isSuccess)
    return (
      <div>
        Email confirmed! Redirecting to login...
        <a href="/login">Go to Login</a>
      </div>
    );

  return <div>Fetching CSRF token...</div>;
};

export default ConfirmEmail;
