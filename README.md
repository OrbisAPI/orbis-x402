# orbis-x402

Call 2,300+ APIs with x402 micropayments (USDC on Base). No API keys. No subscriptions. Pay per call.

```bash
npm install orbis-x402
```

## Quick Start

```javascript
const orbis = require('orbis-x402');

// Search for APIs
const apis = await orbis.search('weather');
console.log(apis[0]); // { slug, name, description, priceUsd, ... }

// Get payment info for a specific API
const info = await orbis.getPaymentInfo('open-weather-api-abc123');
console.log(info.proxyUrl);   // https://orbisapi.com/proxy/open-weather-api-abc123
console.log(info.priceUsd);   // 0.001

// Browse full x402 catalog
const catalog = await orbis.discover({ limit: 20, offset: 0 });
console.log(`${catalog.pagination.total} APIs available`);
```

## x402 Payments

Use with [x402-fetch](https://github.com/coinbase/x402) for automatic payment handling:

```javascript
const { wrapFetchWithPayment } = require('x402-fetch');
const { privateKeyToAccount } = require('viem/accounts');
const { createWalletClient, http } = require('viem');
const { base } = require('viem/chains');

const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const wallet = createWalletClient({ account, chain: base, transport: http() });
const payingFetch = wrapFetchWithPayment(fetch, wallet);

// Now just call the API — payment handled automatically
const result = await payingFetch('https://orbisapi.com/proxy/open-weather-api-abc123/current?city=London');
const data = await result.json();
```

## API

### `search(query, options?)`
Search the marketplace.
- `query` — search string
- `options.limit` — max results (default 10)
- `options.category` — filter by category

### `discover(options?)`
Get the full x402 discovery catalog.
- `options.offset` — pagination offset
- `options.limit` — page size (default 20)

### `getPaymentInfo(apiSlug)`
Get proxy URL, price, and endpoints for a specific API.

### `call(url, options?)`
Low-level call with optional pre-built payment header.

## Links

- [Marketplace](https://orbisapi.com/marketplace)
- [2,300+ APIs](https://orbisapi.com/api/v2/x402/discovery/resources)
- [For Agents](https://orbisapi.com/for-agents)
- [MCP Server](https://orbisapi.com/mcp)
- [Agent Skills](https://github.com/OrbisAPI/agent-skills)

## License
MIT
