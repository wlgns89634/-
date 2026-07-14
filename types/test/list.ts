// 페이지별 DTO 별도 관리 예: 회원가입 관련 DTO는 TS파일 생성후 같은애들 끼리 묶어서 관리

// 리스트 데이터 예시
export type UserRowData = {
  id: string | number;
  name: string;
  email: string;
  gender: string;
  interests: string;
};

// 리스트 데이터 예시
export type UserDetail = {
  id: string | number;
  name: string;
  email: string;
  gender: string;
  interests: string;
};

// 리스트 등록 예시
export type UserPost = {
  id: string | number;
  name: string;
  email: string;
  gender: string;
  interests: string;
};
