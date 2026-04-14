import type { AxiosError } from "axios";
import { isAxiosError } from "axios";

import type { ApiResponse } from "../../types";

export class ApiError extends Error {
  public readonly errorCode: string;

  constructor(message: string, errorCode: string) {
    super(message);
    this.name = "ApiError";
    this.errorCode = errorCode;
  }
}

export const processApiResponse = <T>(response: ApiResponse<T>): T => {
  if (response.success) {
    return response.data;
  }

  throw new ApiError(response.message, response.errorCode);
};

export const getApiErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (isAxiosError(error)) {
    return getAxiosErrorMessage(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
};

const getAxiosErrorMessage = (error: AxiosError) =>
  error.response?.statusText ||
  error.message ||
  "요청 처리 중 오류가 발생했습니다.";
