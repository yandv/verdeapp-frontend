import axios from 'axios';
import { parseCookies } from 'nookies';

export function getAxiosInstance(ctx?: any) {
  const { 'verdeapp.token': token } = parseCookies(ctx);

  const axiosInstance = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (token) {
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return axiosInstance;
}

export const axiosInstance = getAxiosInstance();
