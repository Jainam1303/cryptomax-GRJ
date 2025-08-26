import { useState, useEffect } from 'react';
import api from '../services/api';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface UseAxiosOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  payload?: any;
  initialData?: T | null;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseAxiosReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useAxios = <T>({
  url,
  method = 'GET',
  payload = null,
  initialData = null,
  onSuccess,
  onError
}: UseAxiosOptions<T>): UseAxiosReturn<T> => {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState<number>(0);
  
  const refetch = () => setRefetchIndex(prevIndex => prevIndex + 1);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let response: AxiosResponse<T>;
        
        switch (method) {
          case 'GET':
            response = await api.get<T>(url);
            break;
          case 'POST':
            response = await api.post<T>(url, payload);
            break;
          case 'PUT':
            response = await api.put<T>(url, payload);
            break;
          case 'DELETE':
            response = await api.delete<T>(url);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        
        setData(response.data);
        
        if (onSuccess) {
          onSuccess(response.data);
        }
      } catch (err) {
        const error = err as AxiosError;
        const errorMessage = (error.response?.data as any)?.msg || error.message || 'An error occurred';
        setError(errorMessage);
        
        if (onError) {
          onError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (url) {
      fetchData();
    }
  }, [url, method, payload, refetchIndex, onSuccess, onError]);
  
  return { data, loading, error, refetch };
};

export default useAxios;