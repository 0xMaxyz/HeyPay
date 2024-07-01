export const HaypayAddress = "0x353c5E8402D1d21c2F571aEDeD02d65dd5b037E1";
export interface token{
  token_address:string,
  logo:string,
  symbol:string,
  price:number
  decimals:number
}
export const ValidCoins:token[]=[
  {
    token_address:"0x5dEaC602762362FE5f135FA5904351916053cF70",
    logo:"/USDT.png",
    symbol:"USDT",
    price:1,
    decimals:1000000
  },
  {
    token_address:"0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    logo:"/USDC.png",
    symbol:"USDC",
    price:50000,
    decimals:1000000
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
