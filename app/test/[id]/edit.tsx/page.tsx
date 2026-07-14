// app/institutions/[id]/edit/page.tsx
"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getInstitutionDetail, // 상세조회 API 임포트
  updateInstitution, // 수정 API 임포트
} from "@/apis/test/apiTest";
import { UserPost, UserDetail } from "@/types/test/list";
import FieldForm from "@/components/FieldForm/FieldForm";
import { userFieldConfig } from "@/fields/formField";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPage({ params }: EditPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  // ── 1. [상세 조회] getInstitutionDetail 함수 매핑 ──
  const { data: institutionDetail, isLoading } = useQuery({
    queryKey: ["institution", id],
    queryFn: () => getInstitutionDetail(id), // 올바른 단일 상세조회 함수 호출
    enabled: !!id,
  });

  // ── 2. [수정 처리] updateInstitution 함수 매핑 ──
  const { mutateAsync } = useMutation({
    mutationFn: (data: UserPost) => updateInstitution(id, data), // 올바른 수정 API 호출
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      router.push("/institutions");
    },
  });

  const handleSubmit = async (data: Record<string, unknown>) => {
    // 공통 폼에서 올라온 가공되지 않은 데이터를 DTO(UserPost) 타입으로 변환해 Mutation 실행
    await mutateAsync(data as UserPost);
  };

  // ── 3. 예외 처리 로직 (동작 보완) ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-sm text-muted-foreground animate-pulse">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  // existingRow 변수가 기존에 잘못 체크되고 있었으므로, 가져온 institutionDetail이 없을 때 오류 화면 노출
  if (!institutionDetail) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-sm text-destructive font-medium">
          존재하지 않거나 삭제된 기관입니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/10">
      <FieldForm
        fields={userFieldConfig}
        onSubmit={handleSubmit}
        defaultValues={institutionDetail} //  상세 데이터가 폼 필드에 깔끔하게 파싱되어 바인딩됩니다.
        type="page"
      />
    </div>
  );
}
