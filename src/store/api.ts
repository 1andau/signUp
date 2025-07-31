// src/store/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
//   baseQuery: fetchBaseQuery({ baseUrl: '/api' }),

baseQuery: fetchBaseQuery({
  baseUrl: '/api',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const csrfToken = localStorage.getItem('csrfToken');
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }
    return headers;
  },
}),

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
      query: () => 'auth/csrf-token',
    }),
    confirmEmail: builder.mutation({
      query: (token) => ({
        url: `v1/auth/confirm-email/${token}`,
        method: 'POST', // Используем POST, как указано HR
      

        query: (token:any) => ({
  url: `v1/auth/confirm-email/${token}`,
  method: 'POST',
}),

      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useGetCsrfTokenQuery, useConfirmEmailMutation } = api;