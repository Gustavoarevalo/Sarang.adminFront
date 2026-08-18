export interface InterfaceController<T> {
  success: boolean;
  message: string;
  detail: T;
  status: number;
}

export interface paginationDTO {
  skip: string;
  take: string;
}

export interface CountPage {
  CountPage: number;
}
