import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <h2 className="text-2xl font-bold text-destructive mb-2">
        존재하지 않는 페이지입니다.
      </h2>
      <p className="text-muted-foreground mb-6">
        유효하지 않거나 존재하지 않는 기관 ID 주소입니다. 경로를 다시 확인해
        주세요.
      </p>
      <Link
        href="/institutions"
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        목록으로 가기
      </Link>
    </div>
  );
}
