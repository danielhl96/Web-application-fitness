import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || "/api";
const api = axios.create({
  baseURL,
  withCredentials: true, // falls cookies verwendet werden
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ reject, resolve }) =>
    error ? reject(error) : resolve()
  );
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    console.log(
      "api interceptor caught error:",
      err?.response?.status,
      err?.config?.url
    );

    console.log("Headers:", err?.response?.headers);
    const original = err.config;
    if (!original) return Promise.reject(err);

    // ignore refresh endpoint to avoid infinite loop
    if (original.url && original.url.endsWith("/refresh_token")) {
      return Promise.reject(err);
    }

    if (err.response && err.response.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve: () => resolve(api(original)), reject });
        });
      }
      original._retry = true;
      isRefreshing = true;

      try {
        // call relative URL so Vite proxy is used (same-origin -> cookie sent)
        await axios.post("/api/refresh_token", {}, { withCredentials: true });
        processQueue(null);
        isRefreshing = false;
        console.log("refresh succeeded, retry original:", original.url);
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr);
        isRefreshing = false;
        console.error("refresh failed:", refreshErr);
        // redirect to login as fallback
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
