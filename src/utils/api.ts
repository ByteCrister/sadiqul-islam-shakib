// lib/api.ts
import axios, { AxiosRequestConfig, AxiosError } from "axios";

export async function apiGet<T = any>(url: string, config?: AxiosRequestConfig): Promise<T | null> {
  try {
    const response = await axios.get<T>(url, config);
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function apiPost<T = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<T | null> {
  try {
    const response = await axios.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function apiPut<T = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<T | null> {
  try {
    const response = await axios.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function apiDelete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T | null> {
  try {
    const response = await axios.delete<T>(url, config);
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

function handleError(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", error.response?.data || error.message);
  } else {
    console.error("Unexpected Error:", error);
  }
}
