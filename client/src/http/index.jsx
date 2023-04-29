import axios from "axios";

const $host = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
});

const $download = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
  responseType: "arraybuffer",
});

const $authHost = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
});

const authInterceptor = (config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost, $download };
