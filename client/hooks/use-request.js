import axios from 'axios';
import { useState } from 'react';

export const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errors = error.response?.data?.errors ?? [];
        setErrors(
          <div className="alert alert-danger">
            <h4> Oooops....</h4>
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </div>,
        );
      }
    }
  };

  return { doRequest, errors };
};
