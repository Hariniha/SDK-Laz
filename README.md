LazAI Identity SDK
===================

What this SDK gives you
-----------------------
- Create and persist a lightweight identity for an AI agent instance.
- Attach runtime sessions to identities using `AgentConnector` (session token + persona).
- Ask an LLM/agent (via Alith) using an identity-bound flow with optional on-chain anchoring (mocked).
- Simple personality (persona) management via `PersonalityCore` and session-level persona via `AgentConnector`.
- Demo signing utilities (demo-only `utils/crypto.js`) and a `SignatureEngine` that plugs into the flow.

Install
-------
From the repo root (PowerShell):

```powershell
npm install
```

Environment variables
---------------------
- `GROQ_API_KEY` — required for the Alith Agent (LLM). If missing, LLM calls will be skipped or will throw.
- `NODE_ADDRESS` — used by the anchoring client (mock) and shown in logs.
- `ALITH_MODE` — `server` / `hybrid` etc. Controls runtime mode for the SDK.
- `PRIVATE_KEY` / `DEMO_PRIVATE_KEY` / `WALLET_ADDRESS` — optional: if present, `IdentityManager` can derive and set a `wallet` on the identity.

Quick smoke test
----------------
This repository contains a demo script `test.js` that demonstrates identity creation, wallet derivation (demo), persona usage and the hybrid ask flow.

```powershell
node test.js
```

If you want the full LLM flow to execute, set `GROQ_API_KEY` in a `.env` file or in your environment before running the test.

Core concepts & usage
---------------------
1) Identity

- The SDK generates a unique identity object when first run. The identity shape is:

	{
		id: 'lazai-<hex>',
		wallet: '0x...',   // public address (may be null until set)
		createdAt: 'ISO timestamp'
	}

- Identity is persisted to `lazai-identity.json` by default. To clear it during development, delete that file or use `utils/storage.clearIdentity()`.

2) AgentConnector (session)

- Use `AgentConnector.attach(identity, personalityOptions)` to create a session for a given identity. The session contains:
	- `sessionToken`, `timestamp`
	- `personality` (a `PersonalityCore` instance)
	- `personaContext` (string snapshot)
	- helpers: `setPersonality(obj)`, `getPersonality()`

Example:

```javascript
import AgentConnector from "./src/core/AgentConnector.js";
const session = AgentConnector.attach(identity, { tone: 'friendly', shortBio: 'I help users' });
console.log(session.personaContext);
session.setPersonality({ tone: 'professional' });
```

3) LazAIHybrid (identity + agent + anchoring)

- The `LazAIHybrid` class composes the identity manager, Alith agent client and an anchoring client. It exposes:
	- `ask(prompt)` — runs the agent and returns `{ response, anchored, txHash, node, identity }`.
	- `setPersonality(obj)` / `getPersonality()` — modify the in-process persona used when calling the agent.

Example (session-driven persona):

```javascript
import { LazAIHybrid } from './src/index.js';
import AgentConnector from './src/core/AgentConnector.js';

const lazai = new LazAIHybrid(process.env);
const session = AgentConnector.attach(identity, { tone: 'professional', shortBio: 'I explain decentralization' });
// Apply session persona to the hybrid instance
lazai.setPersonality(session.getPersonality());
const result = await lazai.ask('Explain the value of on-chain anchoring in one paragraph.');
```

Persona (`PersonalityCore`)
--------------------------
- `PersonalityCore` stores `tone`, `style`, `shortBio`, and `extra` fields and can build a short system context via `toContext()`.
- Use it to make agent replies consistent in tone and style; preferable to pass as a system message when the model supports it, otherwise prepend as a short prompt fragment.

Signing & verification (IMPORTANT)
---------------------------------
- `utils/crypto.js` currently implements demo-friendly signing using HMAC-SHA256 and address derivation for local development. This is NOT production-grade.
- If you need real Ethereum-compatible signatures (r/s/v and address recovery), replace `utils/crypto.js` with an implementation that uses `ethers` or a proper ECDSA flow. I can help implement this change.

Persistence & security
----------------------
- The SDK persists only the public `wallet` address and identity metadata by default. It does NOT persist private keys in this demo.
- Do not store private keys in plaintext. Use a secure vault or encryption if you need to persist secrets.

Files to look at (quick)
------------------------
- `src/core/IdentityManager.js` — creates and persists identity
- `src/core/AgentConnector.js` — session attach/connector; now attaches a `PersonalityCore`
- `src/core/LazAi.js` — `LazAIHybrid` orchestrator
- `src/core/PersonalityCore.js` — persona helper
- `src/core/SignatureEngine.js` — high-level signing wrapper (uses `utils/crypto`)
- `utils/storage.js` — simple JSON persistence
- `utils/crypto.js` — demo signing helpers (replace for production)

Recommended next steps
----------------------
1. Decide signing backend: keep demo HMAC for local testing or switch to `ethers` for production signatures.
2. Add `.gitignore` entries for `lazai-identity.json` and `llm_logs/` if you don't want to commit local state/logs.
3. Persist persona per-identity (optional): store the persona in the identity JSON and load it in `IdentityManager`.
4. Add unit tests for identity persistence and sign/verify.

Getting help / contributions
---------------------------
If you want, I can implement any of the recommended changes (ethers signing, persona persistence, system message support). Tell me which and I'll update the code and run the demo.
