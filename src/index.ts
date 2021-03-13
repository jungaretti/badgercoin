import Chain from "./Chain";
import Wallet from "./Wallet";

const jimbo = new Wallet();
const steve = new Wallet();
const elliot = new Wallet();
const keith = new Wallet();

const chain = new Chain(jimbo);
chain.sendMoney(50, jimbo, steve);
chain.sendMoney(400, jimbo, elliot);
chain.sendMoney(40, steve, keith);
chain.sendMoney(220, elliot, keith);

console.log(chain);
