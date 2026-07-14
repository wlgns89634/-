"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInstitutionDetail, updateInstitution } from "@/apis/test/apiTest";
import { UserPost } from "@/types/test/list";
import FieldForm from "@/components/FieldForm/FieldForm";
import { userFieldConfig } from "@/fields/formField";
import { useLoadingStore } from "@/store/Loading";

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const startLoading = useLoadingStore((state) => state.startLoading);
  const endLoading = useLoadingStore((state) => state.endLoading);

  const { data: institutionDetail, isLoading } = useQuery({
    queryKey: ["institution", id],
    queryFn: () => getInstitutionDetail(id),
    enabled: !!id,
  });

  const { mutateAsync } = useMutation({
    mutationFn: (data: UserPost) => updateInstitution(id, data),
    // 등록중 로딩
    onMutate: () => {
      startLoading("정보를 수정하는 중입니다...");
    },

    // 등록 성공
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      router.push("/institutions");
    },

    // 등록 실패
    onError: (error) => {
      alert("수정 중 오류가 발생했습니다.");
    },

    // 성공하든 실패하든 처리가 끝나면(Settled) 무조건 로딩 종료
    onSettled: () => {
      endLoading();
    },
  });

  const handleSubmit = async (data: Record<string, unknown>) => {
    await mutateAsync(data as UserPost);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-sm text-muted-foreground animate-pulse">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    );
  }

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
        defaultValues={institutionDetail}
        type="page"
      />
    </div>
  );
}
