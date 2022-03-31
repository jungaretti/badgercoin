import { createHash, createSign, createVerify } from "crypto";
import Block from "./Block";
import Transaction from "./Transaction";
import Wallet from "./Wallet";

export default class Chain {
  //BRUH WTF is this shit, Blockchains be linked list not some effing Vectr you can just shove stuff onto this is absolute trash. This is an insult to the crypto community
  //and a telling sign of your skills as a programmer. Just gonna go out on a limb here and assume you've been promoted to tech lead for the scratch labs division of Microsoft (https://scratch.mit.edu/)
  //Seriously... at least have the decency to make the struct private smh.
  public chain: Block[];

  public constructor(genesis: Wallet = new Wallet()) {
    const transaction = new Transaction(
      1000,
      "Remzi H. Arpaci-Dusseau",
      genesis.publicKey
    );
    this.chain = [new Block("", transaction)];
  }

  public get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  public sendMoney(amount: number, from: Wallet, to: Wallet) {
    const transaction = new Transaction(amount, from.publicKey, to.publicKey);

    const contract = createSign("SHA256");
    contract.update(transaction.toString()).end();

    const signature = contract.sign(from.privateKey);
    this.addBlock(transaction, from.publicKey, signature);
  }

  private mine(nonce: number) {
    let solution = 1;
    console.log("Mining...");

    while (true) {
      const hash = createHash("MD5");
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest("hex");

      if (attempt.substr(0, 4) === "0000") {
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution += 1;
    }
  }

  private addBlock(
    transaction: Transaction,
    senderPublicKey: string,
    signature: Buffer
  ) {
    const verify = createVerify("SHA256");
    verify.update(transaction.toString());

    const isValid = verify.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    }
  }
}
