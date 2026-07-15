// 쿼리 키 매핑하여 api 불러오는곳에서 호출하기

export const QUERY_KEYS = {
  users: "users",

  institution: {
    list: "institutions",
    detail: "institutions-detail",
    types: "institutions-types",
  },

  employmentInsurance: {
    list: "employment-insurance",
    detail: "employment-insurance-detail",
    applications: "employment-insurance-applications",
  },

  demandSurvey: {
    list: "demand-survey",
  },

  satisfaction: {
    list: "satisfaction",
  },
} as const;
