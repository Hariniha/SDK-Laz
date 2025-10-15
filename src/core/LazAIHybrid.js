// src/core/LazAIHybrid.js
import { default as IdentityManager} from "./IdentityManager.js"
import { AlithAgent } from "./AlithAgent.js";
import { LazAIClient } from "./LazAIClient.js";
import { loadIdentity } from "../../utils/storage.js";
import PersonalityCore from "./PersonalityCore.js";

export class LazAIHybrid {
  constructor(env) {
    this.identity = new IdentityManager();
    this.agent = new AlithAgent();
    this.blockchain = new LazAIClient();
    // persona for this hybrid instance (can be updated per identity/session)
    // If identity has a persisted personality, initialize with it
    const persistedIdentity = loadIdentity();
    this.personality = persistedIdentity && persistedIdentity.personality ? new PersonalityCore(persistedIdentity.personality) : new PersonalityCore();
    this.mode = env.ALITH_MODE || "hybrid";
  }

  async ask(prompt) {
    console.log("⚙️ Running in Hybrid Mode...");

    // Build persona-aware prompt
    const personaContext = this.personality ? this.personality.toContext() : "";
    const promptWithPersona = personaContext ? `${personaContext}\n\n${prompt}` : prompt;

    // 1️⃣ AI response
    const aiResponse = await this.agent.ask(promptWithPersona);

    // 2️⃣ On-chain anchoring - prefer persisted identity so wallet is included if set
    const persisted = loadIdentity() || this.identity.getIdentity();
    const anchor = await this.blockchain.anchorData({
      identity: persisted,
      prompt,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });

    // 3️⃣ Return combined result
    return {
      response: aiResponse,
      ...anchor,
      identity: persisted,
    };
  }

  // Expose simple API to update persona at runtime
  setPersonality(obj = {}) {
    if (obj instanceof PersonalityCore) {
      this.personality = obj;
      // persist the personality state
      this.identity.setPersonality(this.personality);
      return this.personality;
    }
    if (!this.personality) this.personality = new PersonalityCore();
    this.personality.update(obj);
    // Persist per-identity
    try {
      this.identity.setPersonality(this.personality);
    } catch (e) {
      // ignore persistence errors
    }
    return this.personality;
  }

  getPersonality() {
    return this.personality;
  }
}
