// src/utils/apiClient.js
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const getToken = () => localStorage.getItem('adminToken');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

const handleUnauthorized = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('user');
  window.location.href = '/Login-all';
};

// ✅ สำหรับ fetch() — ใช้ใน HorizontalBarChart, StackedBarChartDB, SalesBarChartDB
export const apiFetch = async (path, options = {}) => {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) }
  });
  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }
  return response;
};

export const apiGet = async (path) => {
  const response = await apiFetch(path);
  if (!response.ok) throw new Error(`Failed: ${path}`);
  const data = await response.json();
  return { data };
};

// ✅ สำหรับ axios — ใช้ใน WorkGroupEvaluationResults, QuestionResults, PieChartDB
export const axiosAuth = axios.create({
  baseURL: API_BASE_URL
});

axiosAuth.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) handleUnauthorized();
    return Promise.reject(error);
  }
);

export default apiFetch;