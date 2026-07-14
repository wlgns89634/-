"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import FieldForm from "@/components/FieldForm/FieldForm";
import { FormFieldConfig, TableFilterConfig } from "@/types/form";
import DataTable from "@/components/Table/Table";
import { useModalStore } from "@/store/Modal";
import { VideoModal } from "@/components/VideoContent/VideoContent";
import { FetchTableDataParams } from "@/types/form";
import { createTableApi } from "@/apis/crud";
import { useRouter } from "next/navigation";

const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  label: `${i}시`,
  value: String(i),
}));
const minuteOptions = ["00", "10", "20", "30", "40", "50"].map((m) => ({
  label: `${m}분`,
  value: m,
}));

export const fieldConfig: FormFieldConfig[] = [
  {
    name: "name",
    type: "text",
    label: "이름",
    placeholder: "이름을 입력하세요",
    required: true,
  },
  {
    name: "email",
    type: "email",
    label: "이메일",
    placeholder: "example@email.com",
    required: true,
  },
  {
    name: "role",
    type: "group",
    label: "권한",
    required: true,
    group: [
      {
        name: "hour",
        type: "select",
        label: "시",
        placeholder: "시",
        options: hourOptions,
        required: true,
      },
      {
        name: "minute",
        type: "select",
        label: "분",
        placeholder: "분",
        options: minuteOptions,
        required: true,
      },
    ],
  },
  {
    name: "gender",
    type: "radio",
    label: "성별",
    required: true,
    options: [
      { label: "남성", value: "남성" }, // 💡 힌트: 아래 MOCK_USERS의 값("남성", "여성")과 매칭되도록 밸류 수정
      { label: "여성", value: "여성" },
    ],
  },
  {
    name: "profileImage",
    type: "file",
    label: "프로필 사진",
    placeholder: "이미지를 선택하세요",
    accept: "image/*",
    maxFileSizeMb: 5,
    required: true,
  },
  {
    name: "attachments",
    type: "file",
    label: "첨부파일",
    placeholder: "파일을 선택하세요 (여러 개 가능)",
    accept: ".pdf,.docx",
    maxFileSizeMb: 10,
    multiple: true,
    required: true,
  },
  {
    name: "interests",
    type: "checkboxGroup",
    label: "관심 분야",
    required: true,
    options: [
      { label: "개발", value: "dev" },
      { label: "디자인", value: "design" },
      { label: "기획", value: "planning" },
    ],
  },
  {
    name: "agree",
    type: "checkbox",
    label: "약관동의",
    placeholder: "약관에 동의합니다",
    required: true,
  },
];

interface UserRowData {
  id: number;
  name: string;
  email: string;
  gender: string;
  interests: string;
}

// 💡 실제 화면에 뿌려줄 진짜 순수 가데이터 배열
const LOCAL_MOCK_USERS: UserRowData[] = [
  {
    id: 1,
    name: "김철수",
    email: "chulsoo@naver.com",
    gender: "남성",
    interests: "개발, 기획",
  },
  {
    id: 2,
    name: "이영희",
    email: "younghee@gmail.com",
    gender: "여성",
    interests: "디자인",
  },
  {
    id: 3,
    name: "박영수",
    email: "youngsu@daum.net",
    gender: "남성",
    interests: "개발",
  },
];

// ─────────────── [방법 A] 현재: 실제 백엔드 통신 없이 순수 로컬에서 필터/검색 연산 ───────────────
const mockUserApi = async (params: FetchTableDataParams) => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms 딜레이 효과

  // 1. 검색어 필터링
  let filtered = LOCAL_MOCK_USERS.filter(
    (user) =>
      user.name.includes(params.search) || user.email.includes(params.search),
  );

  // 2. 셀렉트 박스 동적 필터링 처리 (예: gender 필터 대응)
  params.filters.forEach((filter) => {
    if (filter.value && filter.value !== "all") {
      filtered = filtered.filter(
        (user) => (user as any)[filter.id] === filter.value,
      );
    }
  });

  // 3. 페이징 자르기
  const startIndex = (params.page - 1) * params.pageSize;
  const paginatedItems = filtered.slice(
    startIndex,
    startIndex + params.pageSize,
  );

  return {
    items: paginatedItems,
    totalCount: filtered.length,
  };
};

// ─────────────── [방법 B] 미래: 백엔드 주소가 나왔을 때 이것만 주석 풀고 mockUserApi 자리에 교체 ───────────────
const realUserApi = createTableApi<UserRowData>("/users");

const MOCK_COURSE = {
  id: 42,
  title: "[가데이터] Next.js 14 + 오픈소스 UI 프레임워크 마스터 클래스",
  lectures: [
    {
      id: 101,
      title: "1강: 전역 모달 시스템과 오픈소스 분석 (테스트)",
      videoId: "dQw4w9WgXcQ",
      duration: "10분",
      status: "학습 전",
    },
    {
      id: 102,
      title: "2강: React Query와 Axios 인스턴스 연동 실무 (테스트)",
      videoId: "jNQXAC9IVRw",
      duration: "15분",
      status: "학습 완료",
    },
  ],
};

export default function Home() {
  const router = useRouter();
  const open = useModalStore((state) => state.open);
  const targetLecture = MOCK_COURSE.lectures[1];

  const { data: dynamicFilters = [], isLoading: isFilterLoading } = useQuery<
    TableFilterConfig[]
  >({
    queryKey: ["userTableFilters"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return [
        {
          id: "gender",
          placeholder: "성별 전체",
          options: [
            { label: "남성", value: "남성" },
            { label: "여성", value: "여성" },
          ],
        },
      ];
    },
  });

  const handleOpenAlert = () => {
    open({
      type: "content",
      title: "영상 시청",
      content: (
        <VideoModal
          videoId={targetLecture.videoId}
          title={targetLecture.title}
          duration={targetLecture.duration}
          courseId={MOCK_COURSE.id}
          lectureId={targetLecture.id}
          close={close}
        />
      ),
    });
  };

  const columns = useMemo<ColumnDef<UserRowData>[]>(
    () => [
      { accessorKey: "id", header: "번호" },
      { accessorKey: "name", header: "이름" },
      { accessorKey: "email", header: "이메일" },
      { accessorKey: "gender", header: "성별" },
      { accessorKey: "interests", header: "관심 분야" },
    ],
    [],
  );

  const listDetail = (id: string | number) => {
    router.push(`/institutions/${id}`);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-start bg-zinc-50 font-sans dark:bg-black p-8 gap-6 min-h-screen">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <FieldForm fields={fieldConfig} onSubmit={handleSubmit} />
      </div>

      <button onClick={handleOpenAlert}>알림창 열기</button>

      <DataTable
        queryKey="test"
        data={mockUserApi}
        columns={columns}
        filters={dynamicFilters}
        onRowClick={(data) => listDetail(data.id)}
      />
    </div>
  );
}
