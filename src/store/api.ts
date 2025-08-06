import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setToken, logout } from './authSlice';

// Типы для запросов
export interface RegisterRequest {
  name: string;
  password: string;
  email: string;
  mailing_agree?: number;
  blockchain_account_id?: number;
}

interface LoginRequest {
  username: string;
  password_hash: string;
}

interface UsersMe {
  id: string;
  username: string;
  email: string;
  full_name: string;
}

interface RefreshResponse {
  access: string;
}

interface CsrfResponse {
  csrfToken: string;
}

// Базовый запрос
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const csrfToken = localStorage.getItem('csrfToken');
    const accessToken = localStorage.getItem('accessToken');
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

// Обёртка для автоматического обновления токена
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      try {
        const refreshResult = await baseQuery('/auth/refresh-token', api, extraOptions);

        if (refreshResult.data) {
          const newAccessToken = (refreshResult.data as RefreshResponse).access;
          localStorage.setItem('accessToken', newAccessToken);
          api.dispatch(setToken(newAccessToken));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } catch {
        api.dispatch(logout());
      }
    }

    return result;
  };

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    registerUser: builder.mutation<string, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    loginUser: builder.mutation<string, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    getCsrfToken: builder.query<CsrfResponse, void>({
      query: () => '/auth/csrf-token',
    }),
    confirmEmail: builder.mutation<string, string>({
      query: (token) => ({
        url: `/auth/confirm-email/${token}`,
        method: 'POST',
      }),
    }),
    getCurrentUser: builder.query<UsersMe, void>({
      query: () => '/users/me',
    }),
    logoutUser: builder.mutation<string, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'GET',
      }),
    }),
    refreshAccessToken: builder.query<RefreshResponse, void>({
      query: () => '/auth/refresh-token',
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetCsrfTokenQuery,
  useConfirmEmailMutation,
  useRefreshAccessTokenQuery,
  useGetCurrentUserQuery,
  useLogoutUserMutation,
} = api;
