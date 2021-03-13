import { createSign, generateKeyPairSync } from "crypto";
import Transaction from "./Transaction";

export default class Wallet {
  public publicKey: string;
  public privateKey: string;

  constructor() {
    const keypair = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }
}
