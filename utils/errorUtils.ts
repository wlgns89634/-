import axios from "axios";
import {
  HTTP_ERROR_MESSAGES,
  DEFAULT_ERROR_MESSAGE,
} from "@/constants/errorTypes";

export function getErrorMessage(error: unknown): {
  title: string;
  description: string;
} {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    // 서버가 직접 내려준 메시지가 있으면 그걸 우선 사용
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      return {
        title: status
          ? (HTTP_ERROR_MESSAGES[status]?.title ?? DEFAULT_ERROR_MESSAGE.title)
          : DEFAULT_ERROR_MESSAGE.title,
        description: serverMessage,
      };
    }

    // 서버 메시지가 없으면 상태코드 기준 상수 매핑 사용
    if (status && HTTP_ERROR_MESSAGES[status]) {
      return HTTP_ERROR_MESSAGES[status];
    }
  }

  return DEFAULT_ERROR_MESSAGE;
}
