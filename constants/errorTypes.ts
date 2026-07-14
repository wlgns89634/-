// 상황별 코드 상수로 관리 나중에 타협해야됨

export const HTTP_ERROR_MESSAGES: Record<
  number,
  { title: string; description: string }
> = {
  400: {
    title: "잘못된 요청",
    description: "입력하신 정보를 다시 확인해주세요.",
  },
  401: {
    title: "로그인이 필요합니다",
    description: "세션이 만료되었습니다. 다시 로그인해주세요.",
  },
  403: {
    title: "권한이 없습니다",
    description: "이 작업을 수행할 권한이 없습니다.",
  },
  404: {
    title: "찾을 수 없음",
    description: "요청하신 데이터를 찾을 수 없습니다.",
  },
  409: {
    title: "충돌 발생",
    description: "이미 존재하는 데이터이거나 처리 중 충돌이 발생했습니다.",
  },
  422: {
    title: "처리 불가",
    description: "요청 내용을 처리할 수 없습니다. 입력값을 확인해주세요.",
  },
  500: {
    title: "서버 오류",
    description: "일시적인 서버 오류입니다. 잠시 후 다시 시도해주세요.",
  },
  502: {
    title: "서버 응답 오류",
    description: "서버가 일시적으로 응답하지 않습니다.",
  },
  503: {
    title: "서비스 이용 불가",
    description: "서비스 점검 중입니다. 잠시 후 다시 시도해주세요.",
  },
};

// 기본 메시지
export const DEFAULT_ERROR_MESSAGE = {
  title: "오류가 발생했습니다",
  description: "콘솔로 에러코드 확인",
};
