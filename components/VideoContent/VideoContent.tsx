"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/instance";
import { VideoModalProps, ProgressPayload } from "@/types/modalType";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(
  () => import("react-player").then((mod) => mod.default),
  { ssr: false },
) as React.ComponentType<any>;

// 2. 진도율 저장을 위한 커스텀 뮤테이션 훅
function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ProgressPayload) => {
      const { data } = await api.post("/api/lms/progress", payload);
      return data;
    },
    onSuccess: () => {
      // 진도율 저장 성공 시 관련 쿼리(예: 내 강의 리스트, 진도율 현황 등)를 무효화하여 UI 갱신
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      console.log("🎯 진도율이 최신화되었습니다.");
    },
    onError: (error) => {
      console.error("❌ 진도율 저장 중 에러 발생:", error);
    },
  });
}

export function VideoModal({
  videoId,
  courseId,
  lectureId,
  url,
  title,
  duration,
  close,
}: VideoModalProps) {
  const watchTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 리액트 쿼리 뮤테이션 가져오기
  const { mutateAsync: updateProgress, isPending } = useUpdateProgress();

  // 초 단위 시청 시간 기록 타이머 설정
  useEffect(() => {
    timerRef.current = setInterval(() => {
      watchTimeRef.current += 1;
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // [핵심 로직] 현재 시청 기록을 가공하여 리액트 쿼리로 전송하는 함수
  const handleSaveAndClose = async () => {
    // 타이머 즉시 멈춤
    if (timerRef.current) clearInterval(timerRef.current);

    const payload: ProgressPayload = {
      courseId,
      lectureId,
      watchedSeconds: watchTimeRef.current,
      isCompleted: watchTimeRef.current > 30, // 예시: 30초 이상 시청 시 이수 완료 처리
    };

    try {
      // 비동기로 API 전송이 완료될 때까지 await로 대기 (isPending 상태 활용 가능)
      await updateProgress(payload);
    } catch (e) {
      // 에러가 나더라도 사용자의 모달 창은 닫아주기 위해 catch 처리
    } finally {
      close(); // 전역 모달 닫기
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {title}
      {duration}
      <div className="relative aspect-video w-full rounded-md overflow-hidden bg-black shadow-lg">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="LMS 강의 영상"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        {/* <ReactPlayer
          url={url}
          controls
          width="100%"
          height="100%"
          playing={true} // 모달 열리자마자 자동 재생
          // [핵심 2] 영상이 재생되는 동안 주기적으로 (기본 1초마다) 현재까지 시청한 "최대 시간"을 갱신
          //   onProgress={({ playedSeconds }) => {
          //     if (playedSeconds > watchedTimeRef.current) {
          //       watchedTimeRef.current = playedSeconds;
          //     }
          //   }}
          // [핵심 3] 영상 시청이 완벽히 끝났을 때
          //   onEnded={() => {
          //     setIsEnded(true);
          //     console.log("🏆 수강 완료 조건 달성!");
          //     handleSaveAndClose(true); // 영상 끝나면 진도율 100% 및 완료 처리 쏘면서 바로 모달 닫기
          //   }}
        /> */}
      </div>

      {/* 안내 메시지 레이아웃 */}
      <div className="bg-slate-50 border border-slate-200 p-3 rounded-md text-xs text-slate-600 flex items-center justify-between">
        <span>💡 학습 종료 버튼을 눌러야 진도율이 정확하게 기록됩니다.</span>
        {isPending && (
          <span className="text-blue-600 font-semibold animate-pulse">
            저장 중...
          </span>
        )}
      </div>

      {/* 학습 종료 및 닫기 버튼 */}
      <button
        onClick={handleSaveAndClose}
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-md text-sm font-medium transition-colors"
      >
        {isPending ? "학습 결과 저장 중..." : "학습 종료 및 창 닫기"}
      </button>
    </div>
  );
}
