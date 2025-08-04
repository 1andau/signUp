import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setToken, logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
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

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      const refreshResult = await baseQuery('/v1/auth/refresh-token', api, extraOptions);

      if (refreshResult.data) {
        const newAccessToken = (refreshResult.data as any).access;
        localStorage.setItem('accessToken', newAccessToken);
        api.dispatch(setToken(newAccessToken));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }

    return result;
  };

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (body) => ({
        url: 'v1/auth/register',
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: 'v1/auth/login',
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    getCsrfToken: builder.query({
      query: () => 'v1/auth/csrf-token',
    }),
    confirmEmail: builder.mutation({
      query: (token: string) => ({
        url: `v1/auth/confirm-email/${token}`,
        method: 'POST',
      }),
    }),
    getCurrentUser: builder.query<any, void>({
      query: () => ({
        url: 'v1/users/me',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }),
    }),
    logoutUser: builder.mutation<string, void>({
      query: () => ({
        url: 'v1/auth/logout',
        method: 'GET',
      }),
    }),
    refreshAccessToken: builder.query({
      query: () => 'v1/auth/refresh-token',
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
