export type ErrorSource = {
  path: string;
  message: string;
};

export type ErrorResponse = {
  statusCode?: number;
  success: boolean;
  message: string;
  errorSource: ErrorSource[];
  error?: any;
  stack?: string | undefined;
};
