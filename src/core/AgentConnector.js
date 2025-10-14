import IdentityManager from "./IdentityManager.js";
import PersonalityCore from "./PersonalityCore.js";

class AgentConnector {
  /**
   * Attach an identity and optionally provide personality options.
   * Returns a session object that includes a `personality` instance and helpers.
   */
  static attach(identity, personalityOptions = {}) {
    // Only use the provided identity, don't recreate it
    if (!identity) {
      throw new Error("❌ No identity provided to AgentConnector.attach()");
    }

    console.log("🔗 Connecting LazAI Agent for identity:", identity.id);

    const personality = new PersonalityCore(personalityOptions);

    // If identity is an object with a setPersonality method (IdentityManager), attempt to persist
    try {
      // identity might be a raw object; load via IdentityManager to persist
      const IdentityMgr = new IdentityManager();
      // Only set if personalityOptions provided
      if (personalityOptions && Object.keys(personalityOptions).length) {
        IdentityMgr.setPersonality(personality);
      }
    } catch (e) {
      // ignore persistence errors
    }

    const connection = {
      connected: true,
      id: identity.id,
      sessionToken: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
      // attached personality instance and a short context snapshot
      personality,
      personaContext: personality.toContext(),
      // helper to update personality and refresh personaContext
      setPersonality: (obj = {}) => {
        personality.update(obj);
        connection.personaContext = personality.toContext();
        return personality;
      },
      getPersonality: () => personality,
    };

    console.log("✅ Agent connection successful:", {
      id: connection.id,
      sessionToken: connection.sessionToken,
      personaContext: connection.personaContext,
    });
    return connection;
  }
}

export default AgentConnector;
