export type ApiFieldIssue = {
  field: string;
  message: string;
};

export interface ApiResponse<T = any> {
  success: boolean;
  message: string | string[];
  data?: T;
  error?: string;
  code?: string;
  fieldErrors?: Record<string, string>;
  issues?: ApiFieldIssue[];
}
