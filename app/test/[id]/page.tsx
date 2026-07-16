"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DetailView from "@/components/Detail/Detail";
import { userDetailFields } from "@/fields/detailField";
import { userFieldConfig } from "@/fields/formField";
import {
  getInstitutionDetail,
  updateInstitution,
  deleteInstitution,
} from "@/apis/test/apiTest";
import { useModalStore } from "@/store/Modal";
import { useLoadingStore } from "@/store/Loading";
import FieldForm from "@/components/FieldForm/FieldForm";
import { UserPost } from "@/types/test/list";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const open = useModalStore((state) => state.open);
  const startLoading = useLoadingStore((state) => state.startLoading);
  const endLoading = useLoadingStore((state) => state.endLoading);

  // 상세 데이터 조회
  const { data, isLoading } = useQuery({
    queryKey: ["users", "detail", id],
    queryFn: () => getInstitutionDetail(id),
    enabled: !!id,
  });

  // 수정 mutation
  const updateMutation = useMutation({
    mutationFn: (formData: UserPost) => updateInstitution(id, formData),
    onMutate: () => {
      startLoading("정보를 수정하는 중입니다...");
    },
    onSuccess: () => {
      // 상세 데이터 + 목록 둘 다 최신화
      queryClient.invalidateQueries({ queryKey: ["users", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["test"] });
      open({
        type: "alert",
        title: "완료",
        description: "수정이 완료되었습니다.",
      });
    },
    onError: () => {
      open({
        type: "alert",
        title: "오류",
        description: "수정에 실패했습니다.",
      });
    },
    onSettled: () => {
      endLoading();
    },
  });

  // ✅ 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteInstitution(id),
    onMutate: () => {
      startLoading("삭제하는 중입니다...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test"] });
      router.push("/test"); // 삭제 성공하면 목록으로
    },
    onError: () => {
      open({
        type: "alert",
        title: "오류",
        description: "삭제에 실패했습니다.",
      });
    },
    onSettled: () => {
      endLoading();
    },
  });

  // ✅ 수정 버튼 → 폼 모달 → 검증 통과 → confirm → 실제 API 호출까지 완결
  const handleEdit = () => {
    if (!data) return;
    open({
      type: "content",
      title: "회원 수정",
      content: (
        <FieldForm
          fields={userFieldConfig}
          defaultValues={data}
          onSubmit={async (formData) => {
            open({
              type: "confirm",
              title: "수정하시겠습니까?",
              description: "변경사항을 저장합니다.",
              onConfirm: async () => {
                await updateMutation.mutateAsync(formData as UserPost); // ✅ 실제 API 호출 연결
              },
            });
          }}
        />
      ),
    });
  };

  const handleDelete = () => {
    open({
      type: "confirm",
      title: "정말 삭제하시겠습니까?",
      description: "삭제하면 되돌릴 수 없습니다.",
      onConfirm: async () => {
        await deleteMutation.mutateAsync();
      },
    });
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

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-sm text-destructive font-medium">
          존재하지 않거나 삭제된 회원입니다.
        </p>
      </div>
    );
  }

  return (
    <DetailView
      title={data.name}
      data={data}
      fields={userDetailFields}
      onBackClick={() => router.back()}
      onEditClick={handleEdit}
      onDeleteClick={handleDelete}
    />
  );
}
