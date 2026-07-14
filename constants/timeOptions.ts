import { SelectOption } from "@/types/form";

// 셀렉 옵션 시 분
export const HOUR_OPTIONS: SelectOption[] = Array.from(
  { length: 24 },
  (_, i) => ({
    label: `${i}시`,
    value: String(i),
  }),
);

export const MINUTE_OPTIONS: SelectOption[] = [
  "00",
  "10",
  "20",
  "30",
  "40",
  "50",
].map((m) => ({
  label: `${m}분`,
  value: m,
}));
