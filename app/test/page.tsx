"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import FieldForm from "@/components/FieldForm/FieldForm";
import DataTable from "@/components/Table/Table";
import { useModalStore } from "@/store/Modal";
import { VideoModal } from "@/components/VideoContent/VideoContent";
import { FetchTableDataParams } from "@/types/form";
import { createTableApi, createApi } from "@/apis/crud";
import { UserRowData } from "@/types/test/list";
import { userFieldConfig } from "@/fields/formField";
import Loading from "@/components/Loading/Loading";
import { Suspense } from "react";
import Breadcrumb from "@/components/BreadCrumb/BreadCrumb";

// 실제 화면에 뿌려줄 순수 가데이터 배열
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

// [방법 A] 현재: 로컬 mock (검색/필터/페이징 직접 처리)
const mockUserApi = async (params: FetchTableDataParams) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = LOCAL_MOCK_USERS.filter(
    (user) =>
      user.name.includes(params.search) || user.email.includes(params.search),
  );

  params.filters.forEach((filter) => {
    if (filter.value && filter.value !== "all") {
      filtered = filtered.filter(
        (user) => (user as Record<string, unknown>)[filter.id] === filter.value,
      );
    }
  });

  const startIndex = (params.page - 1) * params.pageSize;
  const paginatedItems = filtered.slice(
    startIndex,
    startIndex + params.pageSize,
  );

  return { items: paginatedItems, totalCount: filtered.length };
};

// [방법 B] 미래: 백엔드 준비되면 mockUserApi 자리에 교체
const realUserApi = createTableApi<UserRowData>("/users");

// 등록용 API도 같은 factories 패턴으로 미리 준비
const createUserApi = createApi<UserRowData>("/users");

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

export default function ListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const open = useModalStore((state) => state.open);
  const targetLecture = MOCK_COURSE.lectures[1];

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
    router.push(`/test/${id}`);
  };

  // ── Create: 등록 모달 (신규 추가) ──
  const createMutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test"] }); // DataTable의 queryKey="test"와 동일하게
    },
  });

  const handleAddClick = () => {
    open({
      type: "content",
      title: "회원 등록",
      content: (
        <FieldForm
          fields={userFieldConfig}
          onSubmit={async (data) => {
            // 검증 통과한 데이터를 그대로 submit 모달로 넘김
            open({
              type: "confirm",
              title: "등록하시겠습니까?",
              description: "입력하신 정보로 회원을 등록합니다.",
              onConfirm: async () => {
                await createMutation.mutateAsync(data); // 여기서 실제 API 호출
                close();
                // onConfirm 성공하면 ConfirmModalContent가 자동으로 close() 호출함
              },
            });
          }}
        />
      ),
    });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-start bg-zinc-50 font-sans dark:bg-black p-8 gap-6 min-h-screen">
      <div className="flex gap-2">
        <button onClick={handleOpenAlert}>알림창 열기</button>
        <button onClick={handleAddClick}>+ 회원 등록</button>
      </div>
      <Breadcrumb />
      <Loading />
      <Suspense fallback={null}>
        <DataTable
          queryKey="test" // 위에 리스트 추가 함수(api post) 와 키값 맞추기
          data={mockUserApi} // api 데이터
          columns={columns} // th 헤더
          onRowClick={(data) => listDetail(data.id)} // 상세페이지 넘김 위에함수 참고
        />
      </Suspense>
    </div>
  );
}
