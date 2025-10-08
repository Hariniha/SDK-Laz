import IdentityManager from "./IdentityManager.js";

class AgentConnector {
  static attach(identity) {
    // ✅ Only use the provided identity, don't recreate it
    if (!identity) {
      throw new Error("❌ No identity provided to AgentConnector.attach()");
    }

    console.log("🔗 Connecting LazAI Agent for identity:", identity.id);

    const connection = {
      connected: true,
      id: identity.id,
      sessionToken: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    console.log("✅ Agent connection successful:", connection);
    return connection;
  }
}

export default AgentConnector;
