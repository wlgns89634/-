// types/detail.ts
export type DetailFieldType = "text" | "badge" | "tags" | "date" | "boolean";

export interface DetailFieldConfig {
  key: string; // 데이터에서 꺼낼 키
  label: string; // 화면에 보여줄 라벨
  type?: DetailFieldType; // 표시 방식 (기본 text)
  span?: 1 | 2; // 그리드에서 몇 칸 차지할지 (기본 1)
  formatter?: (value: unknown) => string; // 커스텀 포맷팅 필요할 때
}
