"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DetailView from "@/components/Detail/Detail";
import { userDetailFields } from "@/fields/detailField";
import { userFieldConfig } from "@/fields/formField";
import { getInstitutionDetail, deleteInstitution } from "@/apis/test/apiTest";
import { useModalStore } from "@/store/Modal";
import FieldForm from "@/components/FieldForm/FieldForm";
import { useLoadingStore } from "@/store/Loading";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>(); // 리스트페이지 [id] 값 가져옴
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

  //  삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: deleteInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/users"); // 삭제 성공하면 목록으로 이동
    },
    onError: () => {
      open({
        type: "alert",
        title: "오류",
        description: "삭제에 실패했습니다.",
      });
    },
  });

  // 수정 버튼 클릭 핸들러 (수정 폼 모달 열기)
  const handleEdit = (rowData: typeof data) => {
    if (!rowData) return;
    open({
      type: "content",
      title: "회원 수정",
      content: (
        <FieldForm
          fields={userFieldConfig}
          defaultValues={rowData}
          onSubmit={async (formData) => {
            open({
              type: "confirm",
              title: "수정하시겠습니까?",
              onConfirm: async () => {
                // updateInstitution 같은 실제 수정 API 호출
                queryClient.invalidateQueries({
                  queryKey: ["users", "detail", id],
                });
              },
            });
          }}
        />
      ),
    });
  };

  // 삭제 버튼 클릭 핸들러 (confirm 모달)
  const handleDelete = (targetId: string) => {
    open({
      type: "confirm",
      title: "정말 삭제하시겠습니까?",
      description: "삭제하면 되돌릴 수 없습니다.",
      onConfirm: async () => {
        try {
          startLoading("기관을 삭제하는 중입니다..."); // 로딩 켜기
          await deleteMutation.mutateAsync(targetId);
        } catch (error) {
          console.error(error);
        } finally {
          endLoading(); // 로딩 끄기
        }
      },
    });
  };

  if (isLoading) return <p>불러오는 중...</p>;
  if (!data) return <p>데이터를 찾을 수 없습니다.</p>;

  return (
    <DetailView
      title={data.name}
      data={data}
      fields={userDetailFields}
      onBackClick={() => router.back()}
      onEditClick={() => handleEdit(data)}
      onDeleteClick={() => handleDelete(String(data.id))}
    />
  );
}
