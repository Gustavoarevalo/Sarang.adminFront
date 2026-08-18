//ApirError
export interface ApiResponse<T> {
  message: string;
  detail: T;
  success: boolean;
  status: number;
}
