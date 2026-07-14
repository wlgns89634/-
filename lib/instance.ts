import axios from "axios";
import { ColumnDef } from "@tanstack/react-table";
import { TableFilterConfig } from "@/types/form";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // httpOnly 쿠키 요청 자동임
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 500) {
      console.error("서버 오류가 발생했습니다.");
    }

    return Promise.reject(error);
  },
);
