"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableFilterConfig } from "@/types/form";
import Skeleton from "../Skelton/Skeleton";

export interface FetchTableDataParams {
  page: number;
  search: string;
  filters: { id: string; value: string }[];
  pageSize: number;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: (
    params: FetchTableDataParams,
  ) => Promise<{ items: TData[]; totalCount: number }>;
  filters?: TableFilterConfig[];
  queryKey: string;
  onRowClick?: (row: TData) => void;
}

export default function DataTable<TData>({
  data,
  columns,
  filters = [],
  queryKey,
  onRowClick,
}: DataTableProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search") ?? "";
  const currentPageIndex = pageParam ? Number(pageParam) - 1 : 0;
  const pageSize = 3;

  const [searchInput, setSearchInput] = useState(searchParam);

  const currentColumnFilters = filters
    .map((f) => {
      const urlValue = searchParams.get(f.id);
      return urlValue ? { id: f.id, value: urlValue } : null;
    })
    .filter(Boolean) as { id: string; value: string }[];

  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      queryKey,
      searchParam,
      currentColumnFilters,
      currentPageIndex,
      pageSize,
    ],
    queryFn: () =>
      data({
        search: searchParam,
        filters: currentColumnFilters,
        page: currentPageIndex + 1,
        pageSize,
      }),
    placeholderData: (prev) => prev,
  });

  const tableData = apiResponse?.items ?? [];
  const totalCount = apiResponse?.totalCount ?? 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  const updateQueryParams = (
    updates: Record<string, string | number | null>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => {
    updateQueryParams({ search: searchInput, page: 1 });
  };

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: pageCount,
    manualPagination: true,
    manualFiltering: true,
    state: {
      pagination: {
        pageIndex: currentPageIndex,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          목록 조회
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => {
            const currentValue = searchParams.get(filter.id) ?? "all";

            return (
              <Select
                key={filter.id}
                value={currentValue}
                onValueChange={(value) =>
                  updateQueryParams({ [filter.id]: value, page: 1 })
                }
              >
                <SelectTrigger className="w-[120px] h-9 text-xs">
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{filter.placeholder}</SelectItem>
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })}

          <div className="flex items-center gap-1">
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="검색어 입력..."
              className="h-9 text-sm w-44"
            />
            <Button size="sm" className="h-9" onClick={handleSearch}>
              검색
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-800/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold px-4 py-3 text-xs uppercase text-zinc-700 dark:text-zinc-300"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && tableData.length === 0 ? (
              Array.from({ length: 3 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: columns.length }).map(
                    (_, cellIndex) => (
                      <TableCell key={cellIndex} className="px-4 py-4">
                        <Skeleton className="h-5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-red-500 font-semibold bg-red-50/50 dark:bg-red-950/10"
                >
                  ⚠️ 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/40 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 text-zinc-900 dark:text-zinc-100"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-zinc-500"
                >
                  결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
        <div>
          총{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {totalCount}
          </span>{" "}
          개 중{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {currentPageIndex + 1}
          </span>{" "}
          / {pageCount} 페이지
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => updateQueryParams({ page: 1 })}
            disabled={currentPageIndex === 0}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={() => updateQueryParams({ page: currentPageIndex })}
            disabled={currentPageIndex === 0}
          >
            이전
          </Button>
          {pageNumbers.map((pageIdx) => {
            const isCurrentPage = currentPageIndex === pageIdx;
            return (
              <Button
                key={pageIdx}
                size="sm"
                variant={isCurrentPage ? "default" : "outline"}
                className="h-8 w-8 p-0"
                onClick={() => updateQueryParams({ page: pageIdx + 1 })}
              >
                {pageIdx + 1}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            onClick={() => updateQueryParams({ page: currentPageIndex + 2 })}
            disabled={currentPageIndex >= pageCount - 1}
          >
            다음
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => updateQueryParams({ page: pageCount })}
            disabled={currentPageIndex >= pageCount - 1}
          >
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  );
}
