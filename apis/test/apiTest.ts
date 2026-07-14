import {
  createApi,
  getDetailApi,
  updateApi,
  deleteApi,
  createTableApi,
} from "../crud";
import { API_ENDPOINTS } from "@/apis/endpoints"; // api 앤드포인트 호출
import { UserPost, UserDetail } from "@/types/test/list"; // api dto 매핑 후 호출

// 1. 단일 상세조회용 (getDetailApi 사용)
export const getInstitutionDetail = getDetailApi<UserDetail>(
  API_ENDPOINTS.institutions,
);

// 2. 등록용 (createApi 사용)
export const createInstitution = createApi<UserPost, UserDetail>(
  API_ENDPOINTS.institutions,
);

// 3. 수정용 (updateApi 추가 정의!)
export const updateInstitution = updateApi<UserPost, UserDetail>(
  API_ENDPOINTS.institutions,
);

export const deleteInstitution = deleteApi(API_ENDPOINTS.institutions);
