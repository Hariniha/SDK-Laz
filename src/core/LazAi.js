// src/core/LazAIHybrid.js
import { default as IdentityManager} from "./IdentityManager.js"
import { AlithAgent } from "./AlithClient.js";
import { LazAIClient } from "./LazAIClient.js";

export class LazAIHybrid {
  constructor(env) {
    this.identity = new IdentityManager();
    this.agent = new AlithAgent();
    this.blockchain = new LazAIClient();
    this.mode = env.ALITH_MODE || "hybrid";
  }

  async ask(prompt) {
    console.log("⚙️ Running in Hybrid Mode...");

    // 1️⃣ AI response
    const aiResponse = await this.agent.ask(prompt);

    // 2️⃣ On-chain anchoring
    const anchor = await this.blockchain.anchorData({
      identity: this.identity.getIdentity(),
      prompt,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });

    // 3️⃣ Return combined result
    return {
      response: aiResponse,
      ...anchor,
      identity: this.identity.getIdentity(),
    };
  }
}
