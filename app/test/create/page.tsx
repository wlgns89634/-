"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createInstitution } from "@/apis/test/apiTest"; // api 앤드포인드 담은거 호출
import FieldForm from "@/components/FieldForm/FieldForm";
import { userFieldConfig } from "@/fields/formField";
import { UserPost } from "@/types/test/list";
import { useLoadingStore } from "@/store/Loading";
import { useCallback, useState } from "react";

export default function CreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const startLoading = useLoadingStore((state) => state.startLoading);
  const endLoading = useLoadingStore((state) => state.endLoading);
  const [value, setValue] = useState<UserPost>();

  const { mutateAsync } = useMutation({
    mutationFn: createInstitution,

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

  // 실시간 입력된값 받아옴 만약에 사용해야될때 굳이안써도됨 디버깅용도
  const handleFormChange = (values: Record<string, unknown>) => {
    console.log("실시간 값:", values);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    await mutateAsync(data as UserPost);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/10">
      <FieldForm
        fields={userFieldConfig}
        onSubmit={handleSubmit}
        onChange={handleFormChange}
      />
    </div>
  );
}
