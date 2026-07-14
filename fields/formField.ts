import { FormFieldConfig } from "@/types/form";
import { HOUR_OPTIONS, MINUTE_OPTIONS } from "@/constants/timeOptions"; // 상수들 불러오기

export const userFieldConfig: FormFieldConfig[] = [
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
        options: HOUR_OPTIONS,
        required: true,
      },
      {
        name: "minute",
        type: "select",
        label: "분",
        options: MINUTE_OPTIONS,
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
      { label: "남성", value: "남성" },
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
