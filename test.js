import IdentityManager from "./src/core/IdentityManager.js";
import AgentConnector from "./src/core/AgentConnector.js";
import { LazAIHybrid } from "./src/index.js";

const identityMgr = new IdentityManager();
const identity = identityMgr.getIdentity();

const session = AgentConnector.attach(identity, { tone: "friendly", shortBio: "I assist users" });

const lazai = new LazAIHybrid(process.env);
// apply session persona to the hybrid instance
lazai.setPersonality(session.getPersonality());

const reply = await lazai.ask("Write a short intro about our project.");
console.log(reply);