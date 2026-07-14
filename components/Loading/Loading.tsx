"use client";

import React from "react";
import { useLoadingStore } from "@/store/Loading";

export default function Loading() {
  const { isLoading, message } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] transition-all duration-300">
      <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        {/* 스피너 아이콘 (Tailwind 내장 animate-spin 활용) */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-primary dark:border-zinc-800 dark:border-t-primary" />

        {message && (
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
