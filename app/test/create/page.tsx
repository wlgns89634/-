// app/institutions/new/page.tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createInstitution } from "@/apis/test/apiTest"; // api 앤드포인드 담은거 호출
import FieldForm from "@/components/FieldForm/FieldForm";
import { userFieldConfig } from "@/fields/formField";
import { UserPost } from "@/types/test/list";

export default function CreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: createInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      router.push("/institutions");
    },
  });

  const handleSubmit = async (data: Record<string, unknown>) => {
    await mutateAsync(data as UserPost);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-muted/10">
      <FieldForm fields={userFieldConfig} onSubmit={handleSubmit} />
    </div>
  );
}
