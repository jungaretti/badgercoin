import * as crypto from "crypto";

class Transaction {
  constructor(
    public amount: number,
    public payer: string,
    public payee: string
  ) {}

  toString() {
    return JSON.stringify(this);
  }
}

class Block {
  public nonce = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);

  constructor(
    public prevHash: string,
    public transaction: Transaction,
    public timestamp = Date.now()
  ) {}

  get hash() {
    const data = JSON.stringify(this);
    const hash = crypto.createHash("SHA256");
    hash.update(data).end();
    return hash.digest("hex");
  }
}

class Chain {
  public static global = new Chain();

  chain: Block[];

  constructor() {
    this.chain = [
      new Block(
        "",
        new Transaction(515, "Supreme Leader Remzi H. Arpaci-Dusseau", "jimbo")
      ),
    ];
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  mine(nonce: number) {
    let solution = 1;
    console.log("Mining...");

    while (true) {
      const hash = crypto.createHash("MD5");
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest("hex");

      if (attempt.substr(0, 4) === "0000") {
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution += 1;
    }
  }

  addBlock(
    transaction: Transaction,
    senderPublicKey: string,
    signature: Buffer
  ) {
    const verify = crypto.createVerify("SHA256");
    verify.update(transaction.toString());

    const isValid = verify.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    }
  }
}

class Wallet {
  public publicKey: string;
  public privateKey: string;

  constructor() {
    const keypair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }

  sendMoney(amount: number, payeePublicKey: string) {
    const transaction = new Transaction(amount, this.publicKey, payeePublicKey);

    const contract = crypto.createSign("SHA256");
    contract.update(transaction.toString()).end();

    const signature = contract.sign(this.privateKey);
    Chain.global.addBlock(transaction, this.publicKey, signature);
  }
}

const jimbo = new Wallet();
const steve = new Wallet();
const elliot = new Wallet();
const keith = new Wallet();

jimbo.sendMoney(64, steve.publicKey);
elliot.sendMoney(22, steve.publicKey);
steve.sendMoney(48, keith.publicKey);

console.log(Chain.global);
