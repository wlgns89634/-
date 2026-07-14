"use client";

import { Button } from "@/components/ui/button";
import { DetailFieldConfig } from "@/types/detail";

interface DetailViewProps {
  title: string; // 헤더에 보여줄 제목 (id 등 특정 필드에 종속 안 됨)
  description?: string;
  data: Record<string, unknown>; // ✅ 어떤 도메인 데이터든 들어올 수 있음
  fields: DetailFieldConfig[]; // ✅ DynamicForm의 fields처럼, 뭘 어떻게 보여줄지 외부에서 지정
  onEditClick?: () => void;
  onBackClick?: () => void;
  onDeleteClick?: () => void;
}

export default function DetailView({
  title,
  description,
  data,
  fields,
  onEditClick,
  onBackClick,
  onDeleteClick,
}: DetailViewProps) {
  return (
    <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-6">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          {description && (
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
              {description}
            </span>
          )}
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {onBackClick && (
            <Button variant="outline" size="sm" onClick={onBackClick}>
              목록으로
            </Button>
          )}
          {onEditClick && (
            <Button size="sm" onClick={onEditClick}>
              수정하기
            </Button>
          )}
          {onDeleteClick && (
            <Button size="sm" variant="destructive" onClick={onDeleteClick}>
              삭제하기
            </Button>
          )}
        </div>
      </div>

      {/* 상세 정보 그리드 — fields 배열 기반으로 자동 렌더링 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        {fields.map((field) => (
          <div
            key={field.key}
            className={`space-y-1 ${field.span === 2 ? "sm:col-span-2" : ""}`}
          >
            <span className="text-zinc-400 dark:text-zinc-500 block">
              {field.label}
            </span>
            {renderFieldValue(field, data[field.key])}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderFieldValue(field: DetailFieldConfig, value: unknown) {
  if (field.formatter) {
    return (
      <span className="font-medium text-zinc-800 dark:text-zinc-200">
        {field.formatter(value)}
      </span>
    );
  }

  switch (field.type) {
    case "tags": {
      const items = typeof value === "string" ? value.split(",") : [];
      return (
        <div className="flex gap-1.5 flex-wrap mt-1">
          {items.map((item) => (
            <span
              key={item}
              className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs rounded-md"
            >
              {item.trim()}
            </span>
          ))}
        </div>
      );
    }

    case "boolean":
      return (
        <span className="font-medium text-zinc-800 dark:text-zinc-200">
          {value ? "예" : "아니오"}
        </span>
      );

    case "date":
      return (
        <span className="font-medium text-zinc-800 dark:text-zinc-200">
          {value ? new Date(value as string).toLocaleDateString() : "-"}
        </span>
      );

    default:
      return (
        <span className="font-medium text-zinc-800 dark:text-zinc-200">
          {value != null && value !== "" ? String(value) : "-"}
        </span>
      );
  }
}
