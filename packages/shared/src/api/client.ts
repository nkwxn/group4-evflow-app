export type ApiClientOptions = {
  baseUrl: string;
  fetcher?: typeof fetch;
};

export function createApiClient({ baseUrl, fetcher = fetch }: ApiClientOptions) {
  async function get<T>(path: string): Promise<T> {
    const response = await fetcher(`${baseUrl}${path}`);

    if (!response.ok) {
      throw new Error(`EVFlow API request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  return { get };
}

export function toQueryString(params: Record<string, string | number | boolean | null | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    query.set(key, String(value));
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}
