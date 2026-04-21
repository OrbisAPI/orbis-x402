const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const BASE = 'https://orbisapi.com';

/**
 * Search the Orbis marketplace for APIs
 */
async function search(query, options = {}) {
  const { limit = 10, category } = options;
  const params = new URLSearchParams({ search: query, limit });
  if (category) params.set('category', category);
  const res = await fetch(`${BASE}/api/marketplace/apis?${params}`);
  const data = await res.json();
  return data.apis || data;
}

/**
 * Get full x402 discovery catalog (paginated)
 */
async function discover(options = {}) {
  const { offset = 0, limit = 20 } = options;
  const res = await fetch(`${BASE}/api/v2/x402/discovery/resources?offset=${offset}&limit=${limit}`);
  return res.json();
}

/**
 * Get payment info for a specific API by slug
 */
async function getPaymentInfo(apiSlug) {
  const res = await fetch(`${BASE}/api/marketplace/apis/${apiSlug}`);
  if (!res.ok) throw new Error(`API not found: ${apiSlug}`);
  const api = await res.json();
  return {
    slug: api.slug,
    name: api.name,
    description: api.description,
    proxyUrl: `${BASE}/proxy/${api.slug}`,
    priceUsd: api.price,
    category: api.category,
    endpoints: api.endpoints || []
  };
}

/**
 * Call an Orbis API with x402 payment.
 * Requires a pre-built x402 payment header — use with x402-fetch or coinbase/x402 SDK.
 * 
 * For automatic payment handling, use x402-fetch:
 *   import { wrapFetchWithPayment } from 'x402-fetch';
 *   const fetch = wrapFetchWithPayment(globalThis.fetch, wallet);
 */
async function call(url, options = {}) {
  const { method = 'GET', headers = {}, body, paymentHeader } = options;
  const reqHeaders = { ...headers };
  if (paymentHeader) reqHeaders['X-PAYMENT'] = paymentHeader;
  const res = await fetch(url, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined
  });
  if (res.status === 402) {
    const payment = await res.json();
    throw Object.assign(new Error('Payment required'), { payment402: payment });
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json().catch(() => res.text());
}

module.exports = { search, discover, getPaymentInfo, call };
