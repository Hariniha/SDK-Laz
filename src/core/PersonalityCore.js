/*
 PersonalityCore:
 - stores personality traits (tone, style, short-bio)
 - builds a system prompt fragment for the agent
*/

export default class PersonalityCore {
  constructor(initial = {}) {
    this.tone = initial.tone || "friendly";
    this.style = initial.style || "concise";
    this.shortBio = initial.shortBio || "";
    this.extra = initial.extra || {};
  }

  setTone(t) {
    this.tone = t;
  }

  setStyle(s) {
    this.style = s;
  }

  setShortBio(b) {
    this.shortBio = b;
  }

  toContext() {
    // Builds a short system prompt / context to prepend to user prompts
    const parts = [];
    if (this.shortBio) parts.push(`Bio: ${this.shortBio}`);
    parts.push(`Tone: ${this.tone}`);
    parts.push(`Style: ${this.style}`);
    if (Object.keys(this.extra).length) {
      parts.push(`Extra: ${JSON.stringify(this.extra)}`);
    }
    return parts.join(" | ");
  }

  // merge updates
  update(obj = {}) {
    if (obj.tone) this.tone = obj.tone;
    if (obj.style) this.style = obj.style;
    if (obj.shortBio) this.shortBio = obj.shortBio;
    if (obj.extra) this.extra = { ...this.extra, ...obj.extra };
  }
}
