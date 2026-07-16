import {
  createApi,
  getDetailApi,
  updateApi,
  deleteApi,
  createTableApi,
} from "@/apis/crud";
import { API_ENDPOINTS } from "@/apis/endpoints"; // api 앤드포인트 호출
import { UserPost, UserDetail } from "@/types/test/list"; // api dto 매핑 후 호출

// ─────────────── Mock (지금 당장 쓰는 것) ───────────────
const LOCAL_MOCK_USERS: UserDetail[] = [
  {
    id: 1,
    name: "김철수",
    email: "chulsoo@naver.com",
    gender: "남성",
    interests: "개발, 기획",
  },
  {
    id: 2,
    name: "이영희",
    email: "younghee@gmail.com",
    gender: "여성",
    interests: "디자인",
  },
  {
    id: 3,
    name: "박영수",
    email: "youngsu@daum.net",
    gender: "남성",
    interests: "개발",
  },
];

export const getInstitutionDetail = async (
  id: string,
): Promise<UserDetail | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // 실제 API 느낌 흉내
  return LOCAL_MOCK_USERS.find((u) => String(u.id) === String(id));
};

export const updateInstitution = async (
  id: string,
  data: UserPost,
): Promise<UserDetail> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = LOCAL_MOCK_USERS.findIndex((u) => String(u.id) === String(id));
  if (index === -1) throw new Error("존재하지 않는 회원입니다.");

  LOCAL_MOCK_USERS[index] = { ...LOCAL_MOCK_USERS[index], ...data };
  return LOCAL_MOCK_USERS[index];
};

export const deleteInstitution = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = LOCAL_MOCK_USERS.findIndex((u) => String(u.id) === String(id));
  if (index !== -1) LOCAL_MOCK_USERS.splice(index, 1);
};

// 1. 단일 상세조회용 (getDetailApi 사용)
// export const getInstitutionDetail = getDetailApi<UserDetail>(
//   API_ENDPOINTS.institutions,
// );

// // 2. 등록용 (createApi 사용)
export const createInstitution = createApi<UserDetail, UserPost>(
  API_ENDPOINTS.institutions,
);

// // 3. 수정용 (updateApi 추가 정의!)
// export const updateInstitution = updateApi<UserDetail, UserPost>(
//   API_ENDPOINTS.institutions,
// );

// export const deleteInstitution = deleteApi(API_ENDPOINTS.institutions);
