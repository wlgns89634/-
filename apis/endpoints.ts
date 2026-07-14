// api 앤드포인트 공통으로 쓰는곳

// 같은 페이지 및 기능에 관련 애들끼리 묶어서 관리
export const API_ENDPOINTS = {
  institutions: "/institutions",
  employmentInsurance: "/employment-insurance",
  demandSurvey: "/demand-survey",
  satisfaction: "/satisfaction",
  priceManagement: "/price-management",
  documentReception: "/document-reception",
  coursePlanning: "/course-planning",

  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
  },
} as const;

// SELECT 옵션 엔드포인트 관리 같은것끼리 묶기
export const SELECT_OP = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
  },
} as const;
