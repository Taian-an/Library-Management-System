interface CustomApiRequest {
  method?: string;
}

interface CustomApiResponse {
  status: (code: number) => CustomApiResponse;
  json: (data: unknown) => void;
  end: () => void;
}

export default async function handler(req: unknown, res: unknown): Promise<void> {
  const r = req as CustomApiRequest;
  const s = res as CustomApiResponse;

  if (r.method !== 'POST') {
    return s.status(405).end();
  }

  return s.status(200).json({ 
    message: 'Logout successful' 
  });
}