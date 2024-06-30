export const HaypayAddress = "";
export interface token{
  token_address:string,
  logo:string,
  symbol:string,
  price:number
}
export const ValidCoins:token[]=[
  {
    token_address:"0xa",
    logo:"/HeyPay/USDT.png",
    symbol:"USDT",
    price:1
  },
  {
    token_address:"0xb",
    logo:"/HeyPay/USDC.png",
    symbol:"USDC",
    price:50000
  }
]
function tm(){
  let TokenMaps = new Map<string,token>();
  for(let i=0;i<ValidCoins.length;i++){
    TokenMaps.set(ValidCoins[i].token_address,ValidCoins[i]);
  }
  return TokenMaps;
}

export const TokenMaps = tm();
console.log("Map", TokenMaps);
