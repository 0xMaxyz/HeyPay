
'use client'
import { useEffect, useState } from 'react'
import {HeypayAddress, token, ValidCoins} from "../Constants/Const";
import { CircularProgress } from "@mui/material";
import useNotification from "../Components/SnackBar";
import { publicClient } from '../Utils/client';
import { erc20Abi, keccak256, parseEther, toHex } from 'viem';
import { useAccount, useWriteContract,useWaitForTransactionReceipt } from 'wagmi';
import { HeyPayContractABI } from '../ABI/HeyPayContractABI';

const Send = () => {
  const sendNotification = useNotification();
  const [amount, setAmount] = useState(0);
  const account = useAccount();
  const [reciever, setReciever] = useState<string|undefined>();
  const [balance, setBalance] = useState<number|undefined>(undefined);
  const [allowance, setAllowance] = useState<number|undefined>(undefined);
  // const [contractBalance, setContractBalance] = useState(0);
  const [transactionMessage, setTransactionMessage] = useState("dinner");
  const [loading, setLoading] = useState(false);
  const { data: tokenHash, writeContract:tokenWriteContract } = useWriteContract();
  const {isLoading:approvePending,isSuccess:ApproveSuccess}= useWaitForTransactionReceipt({hash:tokenHash});
  const { data: heypayHash, writeContract:heyPayWriteContract } = useWriteContract();
  const {isLoading:DepositPending,isSuccess:DepositSuccess}= useWaitForTransactionReceipt({hash:heypayHash});

  const [balanceLoding, setBalanceLoading] = useState(false);
  const [selectedtoken, setSelectedToken] = useState<token>(ValidCoins[0]);
  async function ReadBalance() {
    setBalanceLoading(true);
    try {
      if(account.isConnected && selectedtoken.token_address){
        const balance = await publicClient.readContract({
          address: selectedtoken.token_address as `0x${string}`,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args:[account!.address!]
        })
        const allowance = await publicClient.readContract({
          address: selectedtoken.token_address as `0x${string}`,
          abi: erc20Abi,
          functionName: 'allowance',
          args:[account!.address!, HeypayAddress]
        })
        setAllowance(Number(allowance)/selectedtoken.decimals);
        setBalance(Number(balance)/selectedtoken.decimals);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setBalanceLoading(false);
    }
  }
  async function Pay() {
    event?.preventDefault();
    setLoading(true);
    try {
      if(allowance&&balance && allowance>=amount){
        console.log("Send Transaction");

        console.log("Email:", reciever);
        console.log("Email bytes:", keccak256(toHex(reciever!)));
        heyPayWriteContract({
          address: HeypayAddress as `0x${string}`,
          abi: HeyPayContractABI,
          functionName: 'Deposit',
          args: [ keccak256(toHex(reciever!)),
            toHex(transactionMessage),
            selectedtoken.token_address as `0x${string}`,
            BigInt(amount * selectedtoken.decimals)
          ]
        });
      }
      else{
        console.log("Send Approve");
        tokenWriteContract({
          address: selectedtoken.token_address as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [HeypayAddress,BigInt(amount* selectedtoken.decimals)
          ]
        });
      }
      // console.log("1: ",keccak256(toHex(reciever!)))
      // console.log("2: ",toHex(transactionMessage))
      // console.log("3: ",selectedtoken.token_address)
      // console.log("4: ",BigInt(amount * selectedtoken.decimals))

      // if(1)
        // sendNotification({msg:"Hey!! Token Sent successfully",variant:"success"});
      // else{
      //   sendNotification({msg:"Unknown Error occured",variant:"error"});
      // }
      
    } catch (error) {
      // eslint-disable-next-line no-console -- No UI exists yet to display errors
      console.log(error);
      sendNotification({msg:`Error sending token${error}`,variant:"error"});
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if(ApproveSuccess){
      sendNotification({msg:"Hey!! Token Sent successfully",variant:"success"});
      ReadBalance();
    }
  }, [DepositSuccess]);
  useEffect(() => {
    if(ApproveSuccess){
      sendNotification({msg:"Hey!! Token Approved successfully",variant:"success"});
      ReadBalance();
    }
  }, [ApproveSuccess]);
  // ReadBalance();
  useEffect(()=>{
    ReadBalance();
  },[approvePending]);
  useEffect(()=>{
    ReadBalance();
  },[selectedtoken, account.address]);
  return (
    <div className="flex flex-col bg-[#D0F6FF] w-full pt-20 items-center ">
      <div className="min-w-[40rem]  bg-[#81D6E3] rounded-xl max-w-80 border-[0.1rem] shadow-[0.1rem_0.1rem_0_0_rgba(0,0,0,1)] border-black">
        <div className="flex h-16 bg-[#ADE8F2] rounded-t-xl border-b-[0.11rem] border-black pl-5 items-center">
          <a className="font-bold text-lg">Send Money</a>
        </div>
        <form onSubmit={Pay}>
          <div className="flex flex-col p-7 gap-4">
              <div className="flex flex-row gap-5 items-center">
                <a className="w-20 font-bold">Token</a>
                <div>   
                  <select id="tokens" value={JSON.stringify(selectedtoken)} onChange={e=>{setSelectedToken(JSON.parse(e.target.value))}} className="bg-[#81D6E3] border-[0.2rem] rounded-lg h-12 w-32 border-[#29A8BB] " name="tokens">
                    {ValidCoins.map((token,index)=>(<option key={index} value={JSON.stringify(token)}>
                      <div className="flex flex-row">
                        <img src={token.logo} className="w-4 h-4"></img>
                        <a>{token.symbol}</a>
                      </div>
                      
                      </option>))}
                  </select>           
                  <div className="">
                    <a className=" font-light">Balance: </a>
                    {(balanceLoding || balance==undefined)?<CircularProgress size={12} />:
                      <a className="px-1">{balance}</a>
                    }
                  </div>

                </div>        
              </div>
            <div className="flex flex-row gap-5 items-center">
              <a className="w-20 font-bold">Amount</a>
              <input className="bg-[#81D6E3] px-2 border-[0.2rem] rounded-lg h-10 w-32 border-[#29A8BB] "
                        type="number"
                        id='amount'
                        name= 'amount'
                        min= '0'
                        step="any"
                        content={amount.toString()}
                        onChange={e=> setAmount(Number(e.target.value))}
                        placeholder="amount"/>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <a className="w-20 font-bold">To</a>
              <input className="bg-[#81D6E3] border-[0.2rem] rounded-lg h-12 w-64 px-2 fon border-[#29A8BB] "
                        type="email"
                        id='reciever'
                        name= 'reciever'
                        content={reciever}
                        onChange={e=> setReciever(e.target.value)}
                        placeholder="eg. larry.page@gmail.com"
              />
            </div>
            <div className="flex flex-row gap-5 items-center">
              <a className="w-20 font-bold">Description</a>
              <input className="bg-[#81D6E3] px-2 border-[0.2rem] rounded-lg h-12 w-64 border-[#29A8BB] "
                        type="string"
                        id='details'
                        name= 'details'
                        content={transactionMessage}
                        onChange={e=> setTransactionMessage(" "+e.target.value)}
                        placeholder="Description  (Optional)"
              />
            </div>
            <div className="flex flex-row-reverse w-full ">
            {(!approvePending && !DepositPending )?<button disabled={!reciever|| !amount || !selectedtoken} className="w-[10rem] h-[3rem] bg-sky-600 hover:bg-sky-500 disabled:bg-gray-500 disabled:text-slate-700  border-gray-500 text-white  rounded text-xl font-bold" >
              {(allowance!>=amount!)?"Send":"Approve"}</button>:<CircularProgress></CircularProgress>}
              {/* <button className="w-[10rem] h-[3rem] bg-sky-600 hover:bg-sky-500 disabled:bg-gray-500 disabled:text-slate-700  border-gray-500 text-white  rounded text-xl">Transfer</button> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Send