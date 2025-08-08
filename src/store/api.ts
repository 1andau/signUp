import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setToken, logout } from './authSlice';
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  UserFull,
  RefreshResponse,
  CsrfResponse,
} from '../components/types';

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

const baseQueryWithReauthAndCsrf: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    const method =
      typeof args === 'string'
        ? 'GET'
        : args.method
        ? args.method.toUpperCase()
        : 'GET';

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      const csrfToken = localStorage.getItem('csrfToken');
      if (!csrfToken) {
        const csrfResult = await baseQuery('/auth/csrf-token', api, extraOptions);

    if (csrfResult.data && typeof csrfResult.data === 'object' && 'token' in csrfResult.data) {
  localStorage.setItem('csrfToken', (csrfResult.data as { token: string }).token);
}
      }
    }

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
  baseQuery: baseQueryWithReauthAndCsrf,
  endpoints: (builder) => ({
    registerUser: builder.mutation<string, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    loginUser: builder.mutation<LoginResponse, LoginRequest>({
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
    getCurrentUser: builder.query<UserFull, void>({
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
  useLazyGetCsrfTokenQuery,
  useConfirmEmailMutation,
  useRefreshAccessTokenQuery,
  useGetCurrentUserQuery,
  useLogoutUserMutation,
} = api;
