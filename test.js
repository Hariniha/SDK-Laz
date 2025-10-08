import { IdentityManager, AgentConnector } from "./src/index.js";

console.log("⚙️ Initializing LazAI Identity SDK Test...");

async function main() {
  const identity = IdentityManager.create();
  console.log("🧠 Identity created:", identity);

  const connection = AgentConnector.attach(identity);
  console.log("🚀 Agent connected successfully:", connection);
}

main();
