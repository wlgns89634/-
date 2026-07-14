import { FieldErrors } from "react-hook-form";
import { FormFieldConfig } from "@/types/form";
import { useModalStore } from "@/store/Modal";

export function useFormValidationAlert() {
  const open = useModalStore((state) => state.open);

  // fields 순서 기준으로 첫 번째 에러 메시지만 찾아서 모달 오픈
  const handleInvalid = (
    fields: FormFieldConfig[],
    formErrors: FieldErrors,
  ) => {
    const firstMessage = getFirstErrorMessage(fields, formErrors);
    if (firstMessage) {
      open({
        type: "alert",
        description: firstMessage,
      });
    }
  };

  const handleSubmitError = (error: unknown) => {
    const message = extractErrorMessage(error);
    open({ type: "alert", title: "오류가 발생했습니다", description: message });
  };

  return { handleInvalid, handleSubmitError };
}

function getFirstErrorMessage(
  fields: FormFieldConfig[],
  formErrors: FieldErrors,
): string | null {
  for (const field of fields) {
    if (field.type === "group" && field.group) {
      for (const subField of field.group) {
        const error = formErrors[subField.name];
        if (error?.message) return error.message as string;
      }
      continue;
    }

    const error = formErrors[field.name];
    if (error?.message) return error.message as string;
  }

  return null;
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}
