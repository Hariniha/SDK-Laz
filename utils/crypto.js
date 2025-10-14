import { Wallet, verifyMessage } from "ethers";

// Generate a random private key (hex)
export function generatePrivateKey() {
  const wallet = Wallet.createRandom();
  return wallet.privateKey.replace(/^0x/, "");
}

export function addressFromPrivateKey(privateKeyHex) {
  const pk = privateKeyHex.startsWith("0x") ? privateKeyHex : `0x${privateKeyHex}`;
  const wallet = new Wallet(pk);
  return wallet.address;
}

// Sign a message using either:
// - a private key hex string (returns a signature)
// - an ethers Wallet or Signer-like object with signMessage()
export async function signWithWalletMessage(message, signer) {
  if (!signer) throw new Error("signWithWalletMessage: no signer provided");

  // If signer is a string, treat as private key
  if (typeof signer === "string") {
    const pk = signer.startsWith("0x") ? signer : `0x${signer}`;
    const wallet = new Wallet(pk);
    return await wallet.signMessage(message);
  }

  // If signer looks like an ethers Wallet or Signer
  if (typeof signer.signMessage === "function") {
    return await signer.signMessage(message);
  }

  // If signer is an object with privateKey property
  if (signer.privateKey) {
    const pk = signer.privateKey.startsWith("0x") ? signer.privateKey : `0x${signer.privateKey}`;
    const wallet = new Wallet(pk);
    return await wallet.signMessage(message);
  }

  throw new Error("Unsupported signer type for signWithWalletMessage");
}

export function verifySignature(message, signatureHex, expectedAddress = null) {
  try {
    const addr = verifyMessage(message, signatureHex);
    const ok = expectedAddress ? addr.toLowerCase() === expectedAddress.toLowerCase() : true;
    return { ok, address: addr };
  } catch (e) {
    return { ok: false, address: null };
  }
}
