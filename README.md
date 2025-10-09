LazAI Identity SDK
==================

Purpose
-------
Create, manage and use identity-bound AI agents (digital twins) that connect to Alith Agent.

Modes
-----
1. Server mode (Node) - SDK will try to create an Alith Client/Agent if `ALITH_MODE=server` and `PRIVATE_KEY` exists.
2. Proxy mode (Browser) - SDK calls your `serverProxyUrl` endpoints that run Alith on behalf of the client.

Install
-------
npm install
# Install alith on your server if using server mode:
# npm install alith

Quick use (conceptual)
----------------------
import { IdentityManager, AgentConnector } from "@lazai/identity-sdk";

const identity = await IdentityManager.create({ name: "harini.eth", wallet: "0x..." });
const connector = new AgentConnector({ serverProxyUrl: "https://api.yourserver.com" });
const agent = await connector.attach(identity);
const reply = await agent.replyAsUser("Write a short bio.");
