"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "@/types/Navigation";

const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: "m1",
    title: "기관 관리",
    children: [
      { id: "m1-1", title: "기관 목록", path: "/institutions" },
      { id: "m1-2", title: "신규 등록", path: "/institutions/new" },
    ],
  },
  {
    id: "m2",
    title: "마이페이지",
    children: [
      { id: "m2-1", title: "내 프로필", path: "/mypage" },
      { id: "m2-2", title: "활동 로그", path: "/mypage/logs" },
    ],
  },
  {
    id: "m3",
    title: "고객지원",
    path: "/support", // 하위 뎁스(2depth)가 없는 일반 단일 링크도 대응 가능
  },
];

export default function Header() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // [실제 적용] API에서 메뉴 정보를 받아옵니다.
  const { data: menuList = MOCK_MENU_ITEMS } = useQuery<MenuItem[]>({
    queryKey: ["navigationMenu"],
    queryFn: async () => {
      // return await getNavigationMenuAPI(); // 실제 API 연동 시 주석 해제
      return MOCK_MENU_ITEMS;
    },
    staleTime: 1000 * 60 * 5, // 메뉴 데이터는 자주 바뀌지 않으므로 5분 동안 캐싱
  });

  const isActive = (path?: string) => path && pathname === path;

  // 특정 대분류(1depth) 아래에 있는 2depth 중 하나라도 현재 활성화되어 있는지 검사하는 함수
  const isParentActive = (item: MenuItem) => {
    if (item.path && isActive(item.path)) return true;
    if (item.children) {
      return item.children.some((child) => child.path && isActive(child.path));
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* ── 로고 영역 ── */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <span className="h-6 w-6 rounded-lg bg-zinc-900 dark:bg-zinc-100" />
            <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
              BUSAN PLATFORM
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium h-16">
            {menuList.map((menu) => {
              const hasChildren = menu.children && menu.children.length > 0;
              const isCurrentlyActive = isParentActive(menu);

              return (
                <div
                  key={menu.id}
                  className="relative flex items-center h-full"
                  onMouseEnter={() => hasChildren && setActiveDropdown(menu.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {/* 1depth 대메뉴 */}
                  {menu.path ? (
                    <Link
                      href={menu.path}
                      className={`transition-colors hover:text-zinc-900 dark:hover:text-white ${
                        isCurrentlyActive
                          ? "text-zinc-900 dark:text-white font-semibold"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {menu.title}
                    </Link>
                  ) : (
                    <button
                      className={`flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-white cursor-pointer ${
                        isCurrentlyActive
                          ? "text-zinc-900 dark:text-white font-semibold"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {menu.title}
                      {hasChildren && (
                        <svg
                          className="h-3.5 w-3.5 opacity-60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </button>
                  )}

                  {/* 2depth 드롭다운 상자 (하위 메뉴가 존재하고 호버 상태일 때 노출) */}
                  {hasChildren && activeDropdown === menu.id && (
                    <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-44 rounded-lg border border-zinc-100 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in slide-in-from-top-1 duration-150">
                      {menu.children?.map((child) => (
                        <Link
                          key={child.id}
                          href={child.path || "#"}
                          onClick={() => setActiveDropdown(null)} // 클릭 시 드롭다운 닫기
                          className={`block rounded-md px-3 py-2 text-xs transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                            isActive(child.path)
                              ? "bg-zinc-50 font-semibold text-primary dark:bg-zinc-800"
                              : "text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
