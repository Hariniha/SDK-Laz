export default class IdentityManager {
  static create(options = {}) {
    const identity = {
      id: `lazai-id-${Date.now()}`,
      wallet: options.wallet || null,
      name: options.name || null,
      createdAt: Date.now(),
      metadata: options.metadata || {},
      personality: {
        tone: options.tone || "friendly",
        style: options.style || "concise",
        shortBio: options.shortBio || "",
        extra: options.extra || {}
      }
    };

    
    return identity;
  }
}
