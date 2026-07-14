"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분 — 이 시간 안엔 재요청 안 하고 캐시 사용
            retry: 1, // 실패 시 1번만 재시도
            refetchOnWindowFocus: false, // 창 포커스 돌아올 때 자동 재요청 여부
            refetchOnReconnect: true, // 네트워크 재연결 시 자동 재요청
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
