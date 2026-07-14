import { api } from "@/lib/instance";
import { TableFilterConfig, FetchTableDataParams } from "@/types/form";

// 리시트 형식에 페이징 처리 되있는 경우 사용
export const createTableApi = <T>(endpoint: string) => {
  return async (
    params: FetchTableDataParams,
  ): Promise<{ items: T[]; totalCount: number }> => {
    const dynamicFiltersObject = params.filters.reduce(
      (acc, filter) => {
        if (filter.value && filter.value !== "all") {
          acc[filter.id] = filter.value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const response = await api.get(endpoint, {
      params: {
        page: params.page,
        search: params.search,
        pageSize: params.pageSize,
        ...dynamicFiltersObject,
      },
    });

    return response.data;
  };
};

export const fetchTableFilters = async (
  endpoint: string,
): Promise<TableFilterConfig[]> => {
  const response = await api.get(endpoint);
  return response.data;
};

//------- api CRUD -------//

// 데이터 등록 용도
export const createApi = <T, TInput = Record<string, unknown>>(
  endpoint: string,
) => {
  return async (data: TInput): Promise<T> => {
    const response = await api.post(endpoint, data);
    return response.data;
  };
};

// 단일용도 get 리스트형식이지만 페이징 없는 경우에 사용
export const getApi = (endpoint: string) => {
  return async () => {
    const response = await api.get(endpoint);
    return response.data;
  };
};

// 상세페이지 넘어갈때 용도
export const getDetailApi = <T>(endpoint: string) => {
  return async (id: string): Promise<T> => {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  };
};

// 데이터 수정용도
export const updateApi = <T, TInput = Record<string, unknown>>(
  endpoint: string,
) => {
  return async (id: string, data: TInput): Promise<T> => {
    const response = await api.patch(`${endpoint}/${id}`, data);
    return response.data;
  };
};

// 데이터 삭제용도
export const deleteApi = (endpoint: string) => {
  return async (id: string): Promise<void> => {
    await api.delete(`${endpoint}/${id}`);
  };
};
