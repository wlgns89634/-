import { DetailFieldConfig } from "@/types/detail";

export const userDetailFields: DetailFieldConfig[] = [
  { key: "email", label: "이메일 계정" },
  { key: "gender", label: "성별" },
  { key: "interests", label: "관심 분야", type: "tags", span: 2 },
];
