import { ethers } from "ethers";

/*
 Helpers:
 - signPayload(walletOrPrivateKey, message) -> signature
 - verifySignature(message, signature) -> address
 - getAddressFromPrivateKey(privateKey)
*/

export async function signWithWalletMessage(message, signerOrPrivateKey) {
  // signerOrPrivateKey can be:
  // - an ethers.Signer instance
  // - a privateKey string (server mode)
  if (!signerOrPrivateKey) throw new Error("No signer or private key provided");

  if (typeof signerOrPrivateKey === "string") {
    const wallet = new ethers.Wallet(signerOrPrivateKey);
    return wallet.signMessage(message);
  }

  // assume ethers.Signer-like
  if (typeof signerOrPrivateKey.signMessage === "function") {
    return signerOrPrivateKey.signMessage(message);
  }

  throw new Error("Unsupported signer type");
}

export function verifySignature(message, signature) {
  try {
    return ethers.verifyMessage(message, signature); // returns address (ethers v6)
  } catch (e) {
    throw e;
  }
}

export function addressFromPrivateKey(privateKey) {
  const wallet = new ethers.Wallet(privateKey);
  return wallet.address;
}