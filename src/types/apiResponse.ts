export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    [key: string]: any;
  };
}
