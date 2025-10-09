// test.js
import { LazAIHybrid } from "./src/index.js";
import 'dotenv/config';

const lazai = new LazAIHybrid(process.env);

(async () => {
  const res = await lazai.ask("What makes LazAI Network unique,give a short answer?");
  console.log("\n✅ Final Hybrid Output:");
  console.log(res);
})();