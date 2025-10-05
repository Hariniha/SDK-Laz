// index.js
import axios from "axios";

export class LazAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.groq.com/openai/";
  }

  async generate(prompt) {
    const res = await axios.post(`${this.baseUrl}/v1/generate`, { prompt }, {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    });
    return res.data;
  }
}
