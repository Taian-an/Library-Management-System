declare module 'jsonwebtoken' {
  export function sign(payload: Record<string, unknown>, secret: string, options?: Record<string, unknown>): string;
  export function verify(token: string, secret: string): Record<string, unknown>;
}

declare module 'mongoose' {
  export const Schema: unknown; 
  export const models: unknown;
  export function connect(uri: string): Promise<unknown>;
}

interface CustomApiRequest {
  method?: string;
  body: Record<string, unknown>; 
  query: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
}

interface CustomApiResponse {
  status: (code: number) => CustomApiResponse;
  json: (data: unknown) => void;
  end: () => void;
}