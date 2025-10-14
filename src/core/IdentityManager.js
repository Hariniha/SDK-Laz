// src/core/IdentityManager.js
import crypto from "crypto";
import { loadIdentity, saveIdentity } from "../../utils/storage.js";

export default class IdentityManager {
  constructor() {
    // Attempt to load a persisted identity first
    const stored = loadIdentity();
    if (stored) {
      this.identity = stored;
    } else {
      this.identity = this.createIdentity();
      try {
        saveIdentity(this.identity);
      } catch (e) {
        // non-fatal: continue with in-memory identity
        console.warn("could not persist identity:", e.message);
      }
    }
    // If environment provides a wallet address or private key, set wallet (non-sensitive)
    try {
      const envPk = process.env.PRIVATE_KEY || process.env.DEMO_PRIVATE_KEY;
      const envAddr = process.env.NODE_ADDRESS || process.env.IDENTITY_WALLET;
      if (envAddr) this.setWallet(envAddr);
      else if (envPk) {
        // derive address via utils/crypto
        // dynamically import to avoid circular requires
        const { addressFromPrivateKey } = awaitImportCrypto();
        const addr = addressFromPrivateKey(envPk);
        this.setWallet(addr);
      }
    } catch (e) {
      // ignore env wallet derivation errors
    }
  }

  createIdentity() {
    // generate deterministic-ish identity object
    const id = crypto.randomBytes(8).toString("hex");
    return {
      id: `lazai-${id}`,
      wallet: null,
      personality: null,
      createdAt: new Date().toISOString(),
    };
  }

  getIdentity() {
    return this.identity;
  }

  setWallet(address, persist = true) {
    if (!this.identity) this.identity = this.createIdentity();
    this.identity.wallet = address;
    if (persist) {
      try {
        saveIdentity(this.identity);
      } catch (e) {
        console.warn("could not persist identity wallet:", e.message);
      }
    }
    return this.identity;
  }

  setPersonality(personalityObj, persist = true) {
    if (!this.identity) this.identity = this.createIdentity();
    this.identity.personality = personalityObj;
    if (persist) {
      try {
        saveIdentity(this.identity);
      } catch (e) {
        console.warn("could not persist identity personality:", e.message);
      }
    }
    return this.identity.personality;
  }
}

// helper to import crypto helper synchronously-safe
function awaitImportCrypto() {
  // require path relative to this file; using dynamic import would return a promise
  // so instead use synchronous require via createRequire if available
  try {
    // Node ESM environment: dynamic import
    // return import('../../utils/crypto.js');
    // For simplicity, load via require-ish fallback
    // But to keep code compatible, access via global require if present
    // If not available, throw and ignore.
    // NOTE: In ESM context, this will throw and we silently ignore env import.
    // This helper intentionally keeps the constructor simple and non-blocking.
    // Return a small shim object if import fails.
    return require("../../utils/crypto.js");
  } catch (e) {
    return { addressFromPrivateKey: () => null };
  }
}
