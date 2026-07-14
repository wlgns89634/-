import React from "react";
import { UserDetail } from "@/types/test/list";
import { Button } from "@/components/ui/button";

interface InstitutionDetailProps {
  data: UserDetail;
  onEditClick?: () => void;
  onBackClick?: () => void;
  onDeleteClick?: () => void;
}

export default function Detail({
  data,
  onEditClick,
  onBackClick,
  onDeleteClick,
}: InstitutionDetailProps) {
  return (
    <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-6">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
            ID: {data.id}
          </span>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            {data.name}
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
            <Button size="sm" onClick={onEditClick}>
              삭제하기
            </Button>
          )}
        </div>
      </div>

      {/* 상세 정보 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div className="space-y-1">
          <span className="text-zinc-400 dark:text-zinc-500 block">
            이메일 계정
          </span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {data.email}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-zinc-400 dark:text-zinc-500 block">성별</span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {data.gender}
          </span>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <span className="text-zinc-400 dark:text-zinc-500 block">
            관심 분야
          </span>
          <div className="flex gap-1.5 flex-wrap mt-1">
            {data.interests.split(",").map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs rounded-md"
              >
                {interest.trim()}
              </span>
            ))}
          </div>
        </div>

        {data.interests && (
          <div className="space-y-1 sm:col-span-2">
            <span className="text-zinc-400 dark:text-zinc-500 block">
              상세 설명
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 whitespace-pre-wrap leading-relaxed">
              {data.interests}
            </p>
          </div>
        )}
      </div>

      {/* 푸터 영역 */}
      <div className="text-right text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-800 pt-4">
        등록일: {data.gender}
      </div>
    </div>
  );
}
