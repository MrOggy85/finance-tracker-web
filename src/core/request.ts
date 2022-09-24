import axios, { Method } from 'axios';

type Params = {
  path: string;
  method: Method;
  data: Record<string, unknown>;
};

async function request<T>({ path, method, data }: Params) {
  const response = await axios({
    url: path,
    baseURL: process.env.REACT_APP_BASE_URL,
    method,
    data,
  });

  return response.data as T;
}

export default request;
