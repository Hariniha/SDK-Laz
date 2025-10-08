    export const DEFAULTS = {
  model: "gpt-3.5-turbo",
  network: "testnet",
  fileId: 10n,
  nodeAddress: null,
  serverProxyUrl: null, // e.g. https://your-proxy.example
  alithMode: process.env.ALITH_MODE || (process.env.PRIVATE_KEY ? "server" : "proxy")
};

// small helper to normalize config merge
export function normalizeConfig(overrides = {}) {
  return { ...DEFAULTS, ...overrides };
}
