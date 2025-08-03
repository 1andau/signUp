import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setToken, logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  credentials: 'include', // обязательно для передачи куки
  prepareHeaders: (headers) => {
    const csrfToken = localStorage.getItem('csrfToken');
    const accessToken = localStorage.getItem('accessToken'); // если сохраняешь access
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

// Обёртка для автообновления access токена
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Если access токен истёк — пробуем обновить
    if (result.error && result.error.status === 401) {
      const refreshResult = await baseQuery('/v1/auth/refresh-token', api, extraOptions);

      if (refreshResult.data) {
        const newAccessToken = (refreshResult.data as any).access;
        localStorage.setItem('accessToken', newAccessToken);
        api.dispatch(setToken(newAccessToken));

        // Повторяем оригинальный запрос с новым токеном
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout()); // если refresh тоже не сработал
      }
    }

    return result;
  };

export const api = createApi({
  baseQuery: baseQueryWithReauth, // заменили!
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

    getCurrentUser: builder.query({
  query: () => ({
    url: 'v1/users/me',
    method: 'GET',
    headers: {
      // Можно не писать, если ты автоматизируешь это через prepareHeaders
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
useLogoutUserMutation
} = api;
