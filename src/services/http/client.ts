import axios from 'axios';

import { env } from '@/config/env';

import { AppError } from './errors';

export const http = axios.create({
  baseURL: env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10_000
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status as number | undefined;
    const message = error?.response?.data?.message ?? 'Network request failed';

    throw new AppError(message, 'HTTP_ERROR', status);
  }
);
