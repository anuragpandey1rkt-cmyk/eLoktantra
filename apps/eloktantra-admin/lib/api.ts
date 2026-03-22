import axios from 'axios';
import { getSession } from 'next-auth/react';

const backendAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NESTJS_API_URL || 'https://backend-elokantra.onrender.com',
  timeout: 10000,
});

backendAPI.interceptors.request.use(async (config) => {
  const session: any = await getSession();
  if (session?.backendToken) {
    config.headers.Authorization = `Bearer ${session.backendToken}`;
  }
  return config;
});

export default backendAPI;
