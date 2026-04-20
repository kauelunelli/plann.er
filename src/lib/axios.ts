import axios, { InternalAxiosRequestConfig } from "axios";
import { getReadableErrorMessage } from "./api-error";
import { notify } from "./toast-service";

export const api = axios.create({
  baseURL: "http://localhost:3333",
});

type ConfigWithFlags = InternalAxiosRequestConfig & {
  skipErrorToast?: boolean;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error?.config as ConfigWithFlags | undefined;
    const skipToast = Boolean(config?.skipErrorToast);

    if (!skipToast) {
      notify(getReadableErrorMessage(error), "error");
    }

    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem("TOKEN_KEY");
    }

    return Promise.reject(error);
  }
);