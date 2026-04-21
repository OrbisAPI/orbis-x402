export interface SearchOptions {
  limit?: number;
  category?: string;
}

export interface ApiInfo {
  slug: string;
  name: string;
  description: string;
  proxyUrl: string;
  priceUsd: number;
  category: string;
  endpoints: Array<{ method: string; path: string; description: string }>;
}

export interface DiscoveryResult {
  x402Version: number;
  items: Array<{
    resource: string;
    type: string;
    accepts: Array<{
      scheme: string;
      network: string;
      amount: string;
      asset: string;
      payTo: string;
    }>;
    metadata: {
      name: string;
      description: string;
      tags: string[];
      priceUsd: number;
    };
  }>;
  pagination: { limit: number; offset: number; total: number };
}

export interface CallOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  paymentHeader?: string;
}

export function search(query: string, options?: SearchOptions): Promise<any[]>;
export function discover(options?: { offset?: number; limit?: number }): Promise<DiscoveryResult>;
export function getPaymentInfo(apiSlug: string): Promise<ApiInfo>;
export function call(url: string, options?: CallOptions): Promise<unknown>;
