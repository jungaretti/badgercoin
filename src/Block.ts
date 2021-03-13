import { createHash } from "crypto";
import Transaction from "./Transaction";

export default class Block {
  public nonce = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);

  public constructor(
    public prevHash: string,
    public transaction: Transaction,
    public timestamp = Date.now()
  ) {}

  public get hash() {
    const data = JSON.stringify(this);
    const hash = createHash("SHA256");
    hash.update(data).end();
    return hash.digest("hex");
  }
}
