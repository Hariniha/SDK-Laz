import { signWithWalletMessage, verifySignature, addressFromPrivateKey } from "../../utils/crypto.js";

/*
 SignatureEngine provides:
 - signAsIdentity(identity, message, options) -> signature
 - verify(message, signature) -> address
 - quick utility: signBundle (message + metadata)
*/

export default class SignatureEngine {
  constructor(options = {}) {
    // options.signer can be:
    // - ethers.Signer instance (browser wallet signer passed by developer)
    // - privateKey string (server mode)
    this.signer = options.signer || null;
  }

  // sign message with whatever signer available
  async signMessage(message, signerOverride = null) {
    const signer = signerOverride || this.signer;
    if (!signer) throw new Error("No signer available to sign message");
    return await signWithWalletMessage(message, signer);
  }

  // sign identity-specific message (includes identity id + wallet)
  async signAsIdentity(identity, message, signerOverride = null) {
    const payload = JSON.stringify({
      identityId: identity.id,
      wallet: identity.wallet,
      message,
      timestamp: Date.now()
    });
    return await this.signMessage(payload, signerOverride);
  }

  verify(message, signature) {
    // verifies and returns address
    return verifySignature(message, signature);
  }

  static addressFromPrivateKey(pk) {
    return addressFromPrivateKey(pk);
  }
}
