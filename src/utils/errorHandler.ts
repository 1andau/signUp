import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ApiError {
  message: string;
}

export const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined): string => {
  if (!error) return 'Unknown error';

  if ('status' in error) {
    // Это FetchBaseQueryError
    const fetchError = error as FetchBaseQueryError;
    if (fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data) {
      return (fetchError.data as ApiError).message;
    }
    return 'Server error';
  }

  // Это SerializedError
  return error.message || 'Unknown error';
};