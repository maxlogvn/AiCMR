import axios, { AxiosError, InternalAxiosRequestConfig, AxiosProgressEvent } from "axios";

export type { AxiosProgressEvent };

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const isServer = typeof window === "undefined";

const api = axios.create({
  baseURL: isServer ? "http://backend:8000/api/v1" : "/backend/api/v1",
});

let csrfTokenPromise: Promise<string | null> | null = null;

export async function getCsrfToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  if (!csrfTokenPromise) {
    csrfTokenPromise = (async () => {
      try {
        const response = await axios.get("/backend/api/v1/csrf-token", {
          withCredentials: true,
          headers: { "Cache-Control": "no-cache" },
        });
        return response.data.csrf_token;
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
        csrfTokenPromise = null;
        return null;
      }
    })();
  }
  return csrfTokenPromise;
}

export async function initCsrfToken() {
  await getCsrfToken();
}

let isRefreshing = false;

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (
      ["post", "put", "delete", "patch"].includes(
        config.method?.toLowerCase() || "",
      )
    ) {
      const csrf = await getCsrfToken();
      if (csrf) {
        config.headers["X-CSRF-Token"] = csrf;
        config.withCredentials = true;
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig;

    if (
      error.response?.status === 403 &&
      (error.response.data as { detail?: string })?.detail ===
        "Invalid CSRF token"
    ) {
      csrfTokenPromise = null;
      const newToken = await getCsrfToken();
      if (newToken && originalRequest.headers) {
        originalRequest.headers["X-CSRF-Token"] = newToken;
        return api(originalRequest);
      }
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          const checkToken = setInterval(() => {
            if (!isRefreshing) {
              clearInterval(checkToken);
              const newToken = localStorage.getItem("access_token");
              if (newToken && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(api(originalRequest));
              } else {
                resolve(Promise.reject(error));
              }
            }
          }, 100);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await api.post("/auth/refresh", {
          refresh_token: refreshToken,
        });
        const { access_token, refresh_token: new_refresh_token } =
          response.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", new_refresh_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

import type {
  Attachment,
  Settings,
  StatsOverview,
  UpdateSettingsRequest,
  PublicSettingsResponse,
} from "@/types";

export const settingsApi = {
  getSettings: () => api.get<Settings>("/settings/"),
  getPublicSettings: () => api.get<PublicSettingsResponse>("/settings/public"),
  updateSettings: (data: UpdateSettingsRequest) =>
    api.put<Settings>("/settings/", data),
};

export const uploadsApi = {
  uploadFile: (file: File, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void, isPublic: boolean = false) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<Attachment>(`/uploads/?is_public=${isPublic}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },
  getAttachment: (id: number) => api.get<Attachment>(`/uploads/${id}/`),
  deleteAttachment: (id: number) => api.delete(`/uploads/${id}/`),
  getFileUrl: (idOrUrl: number | string | null | undefined, isPublic?: boolean, filename?: string) => {
    if (!idOrUrl) return "";

    // Nếu là URL đầy đủ (http...) thì trả về luôn
    if (typeof idOrUrl === "string" && idOrUrl.startsWith("http")) {
      return idOrUrl;
    }

    // Nếu backend đã trả về URL hoàn chỉnh, sử dụng trực tiếp
    if (typeof idOrUrl === "string") {
      // URL public từ backend có dạng /media/{id}/{slug}
      if (idOrUrl.startsWith("/media/")) {
        return idOrUrl;
      }
      
      // URL private từ backend có dạng /backend/api/v1/uploads/file/{id}
      if (idOrUrl.startsWith("/backend/api/v1/uploads/file/")) {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("access_token");
          if (token && !idOrUrl.includes("?token=")) {
            return `${idOrUrl}?token=${token}`;
          }
        }
        return idOrUrl;
      }

      // Trích xuất ID nếu là các URL pattern khác
      let id = idOrUrl;
      if (idOrUrl.includes("/api/v1/uploads/file/")) {
        id = idOrUrl.split("/").pop() || idOrUrl;
      } else if (idOrUrl.includes("/api/v1/uploads/p/")) {
        // URL public có dạng /p/{id}/{slug}
        const parts = idOrUrl.split("/");
        id = parts[parts.length - 2] || idOrUrl;
      }

      // Generate URL cho các pattern khác
      if (isPublic) {
        const slug = filename ? filename.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "file";
        return `/media/${id}/${slug}`;
      }

      const baseUrl = `/backend/api/v1/uploads/file/${id}`;
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token) {
          return `${baseUrl}?token=${token}`;
        }
      }
      return baseUrl;
    }

    // Nếu chỉ có ID number
    if (isPublic) {
      const slug = filename ? filename.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "file";
      return `/media/${idOrUrl}/${slug}`;
    }

    const baseUrl = `/backend/api/v1/uploads/file/${idOrUrl}`;
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        return `${baseUrl}?token=${token}`;
      }
    }
    return baseUrl;
  },
};

export const statsApi = {
  getStatsOverview: () => api.get<StatsOverview>("/stats/overview"),
};

export default api;
