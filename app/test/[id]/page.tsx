"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Detail from "@/components/Detail/Detail";
import Skeleton from "@/components/Skelton/Skeleton";
import { useModalStore } from "@/store/Modal";

// 💡 백엔드 API 대신 테스트용으로 뿌려줄 임시 상세 데이터 (DTO 규격 매칭)
const MOCK_INSTITUTION_DETAIL = (id: string) => ({
  id: id || "999",
  name: "부산 정보기술 진흥원 (임시)",
  email: "busan_it@contact.or.kr",
  gender: "남성", // (기존 데이터 호환용 필드)
  interests: "개발, 디자인, 기획",
  description:
    "Next.js App Router와 React Query 연동 및 전역 모달 시스템 검증을 위해 프론트엔드단에서 임시로 생성한 가데이터입니다. 실제 백엔드가 붙으면 이 내용은 서버 데이터로 대체됩니다.",
  createdAt: "2026-07-13",
});

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const open = useModalStore((state) => state.open);
  const id = params?.id as string;

  const {
    data: institution,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["Detail", id],

    // ⭕ [수정] 실제 API 대신 0.3초 뒤에 가데이터를 뱉어내도록 임시 처리
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms 로딩 효과
      return MOCK_INSTITUTION_DETAIL(id);
    },
    enabled: !!id,
  });

  const handleDelete = () => {
    open({
      type: "alert",
      title: "정말 삭제하시겠습니까?",
      onConfirm: async () => {
        // await deleteMutation.mutateAsync(id); // api 앤드포인트 보내는곳
        console.log(`${id}번 아이템 삭제 처리됨`);
      },
    });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-start bg-zinc-50 dark:bg-black p-8 min-h-screen">
      {/* 케이스 1: 로딩 중일 때 (Skeleton UI) */}
      {isLoading && (
        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6">
          <Skeleton className="h-8 w-1/3 bg-zinc-200 dark:bg-zinc-800" />
          <hr className="border-zinc-100 dark:border-zinc-800" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-full bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800" />
            <Skeleton className="h-24 w-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      )}

      {/* 케이스 2: 에러가 발생했거나 데이터가 없을 때 */}
      {(isError || (!isLoading && !institution)) && (
        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-12 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center space-y-4">
          <p className="text-red-500 font-semibold">
            ⚠️ 존재하지 않거나 정보를 불러올 수 없는 기관입니다.
          </p>
          <button
            onClick={() => router.push("/institutions")}
            className="text-sm text-zinc-500 hover:text-zinc-700 underline transition"
          >
            목록으로 돌아가기
          </button>
        </div>
      )}

      {/* 케이스 3: 데이터 Fetch 성공 시 (공통 상세 컴포넌트 출력) */}
      {institution && !isLoading && !isError && (
        <Detail
          data={institution}
          onBackClick={() => router.push("/institutions")}
          onEditClick={() => router.push(`/institutions/${id}/edit`)}
          onDeleteClick={handleDelete}
        />
      )}
    </div>
  );
}
