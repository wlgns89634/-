import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-100 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 md:flex md:items-center md:justify-between">
        {/* ── 좌측 저작권 영역 ── */}
        <div className="space-y-2 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400 md:text-left">
            &copy; {currentYear} Busan IT Promotion Agency. All rights reserved.
          </p>
          <p className="text-center text-[10px] leading-5 text-zinc-400 dark:text-zinc-500 md:text-left">
            본 사이트는 Next.js와 React Query 기반으로 설계된 부산 플랫폼 관리
            도구입니다.
          </p>
        </div>

        {/* ── 우측 하단 푸터 링크 목록 ── */}
        <div className="flex justify-center space-x-6 md:order-2 mt-4 md:mt-0 text-xs text-zinc-500 dark:text-zinc-400">
          <Link
            href="/privacy"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            개인정보처리방침
          </Link>
          <Link
            href="/terms"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            이용약관
          </Link>
          <Link
            href="/support"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            고객지원
          </Link>
        </div>
      </div>
    </footer>
  );
}
