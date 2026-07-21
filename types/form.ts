// types/dynamic-form.ts
export type FieldType =
  | "text"
  | "email"
  | "password"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "checkboxGroup"
  | "radio"
  | "file"
  | "date"
  | "group";

export type SelectOption = {
  label: string;
  value: string;
};

export type FormFieldConfig = {
  name: string;
  type: FieldType;
  title?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  minLength?: number;
  maxLength?: number;
  group?: FormFieldConfig[];
  accept?: string; // 파일 타입 제한 (예: "image/*", ".pdf,.docx")
  maxFileSizeMb?: number;
  multiple?: boolean;
  minDate?: Date;
  maxDate?: Date;
  minDateField?: string;
  maxDateField?: string;
};

// 테이블 필터용
export type TableFilterConfig = {
  id: string;
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
};

// 테이블 파람스
export type FetchTableDataParams = {
  page: number;
  search: string;
  filters: { id: string; value: string }[];
  pageSize: number;
};
