// src/core/AlithAgent.js
import { Agent } from "alith";
import 'dotenv/config';

export class AlithAgent {
  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ_API_KEY in .env");
    }

    this.agent = new Agent({
      model: "openai/gpt-oss-120b",
      apiKey: process.env.GROQ_API_KEY,
      baseUrl: "https://api.groq.com/openai/v1",
    });
  }

  async ask(prompt) {
    try {
      const res = await this.agent.prompt(prompt);
      return res;
    } catch (err) {
      console.error("❌ Alith Agent Error:", err.message);
      throw err;
    }
  }
}
