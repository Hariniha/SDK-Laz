// src/core/IdentityManager.js
import crypto from "crypto";

export default class IdentityManager {
  constructor() {
    this.identity = this.createIdentity();
  }

  createIdentity() {
    // generate deterministic identity
    const id = crypto.randomBytes(8).toString("hex");
    return `lazai-${id}`;
  }

  getIdentity() {
    return this.identity;
  }
}
