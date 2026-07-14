// 헤더 네비 메뉴
export interface MenuItem {
  id: string;
  title: string;
  path?: string; // 1depth가 단순 폴더(대분류) 역할이면 경로가 없을 수 있음
  children?: MenuItem[]; // 하위 메뉴 (2depth)
}
