import { HeyPayContractABI } from "../ABI/HeyPayContractABI";
import { HeypayAddress, TokenMaps } from "../Constants/Const";
import {ClaimRow} from "../Interfaces/types"
import { publicClient } from "../Utils/client";
export const getClaimables = async(emailKec:`0x${string}`):Promise<ClaimRow[]>=>{
    const claimRows = new Promise<ClaimRow[]>(async(resolve,reject)=>{
        const totalClaimables = await publicClient.readContract({
          address: HeypayAddress,
          abi: HeyPayContractABI,
          functionName: 'claimsIndex',
          args:[emailKec]
        })
        console.log("totalClaimables",totalClaimables)
        let tempClaimRows:ClaimRow[]=[];
        for( let i=0;i<Number(totalClaimables);i++){ 
          console.log("get URI:",i);
          const claimable = await publicClient.readContract({
            address: HeypayAddress,
            abi: HeyPayContractABI,
            functionName: 'claims',
            args:[emailKec,BigInt(0)]
          })
          let claimRow:ClaimRow = {} as ClaimRow;
          claimRow.token_address = claimable[0];
          let token =TokenMaps.get(claimRow.token_address);
          claimRow.amount = Number(claimable[1])/token!.decimals;
          claimRow.decimals = token!.decimals;
          claimRow.logo = token!.logo;
          claimRow.symbol = token!.symbol;
          claimRow.price = token!.price
          claimRow.sender = claimable[2];
          claimRow.metadata = claimable[3];
          tempClaimRows.push(claimRow);
        } 
        console.log(tempClaimRows);
        resolve(tempClaimRows);
    })
    return claimRows;
}