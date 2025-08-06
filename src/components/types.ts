

export interface RegisterRequest {
  name: string; 
  password: string;
  email: string;
  mailing_agree: 0 | 1;
  blockchain_account_id?: number | null;
}

export interface LoginRequest {
  username: string;
  password_hash: string; 
}


export interface UserFull {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  mailing_agree: number;
  extension?: Record<string, unknown> | null;
  blockchain_account_id?: number | null;
  pricing_plan_id?: string | null;
}

export interface LoginResponse {
  access: string;
  user: UserFull;
}

export interface RefreshResponse {
  access: string;
}

export interface CsrfResponse {
  csrfToken: string;
}


export interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationErrorItem[];
}
