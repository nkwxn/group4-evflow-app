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

