'use client'
import { useEffect, useRef, useState } from 'react'
import { ClaimRow } from "../Interfaces/types";
import ClaimCard from "../Components/ClaimCard";
import CircularProgress from '@mui/material/CircularProgress';
import ClaimMessage from "../Components/ClaimMessage";
import NothingMessage from "../Components/NothingMessage";
import AddressViewer from "../Components/AddressViewer";
import { TokenMaps } from "../Constants/Const";
import useNotification from "../Components/SnackBar";
import { useAccount } from 'wagmi';
  interface ClaimResults{
    token: string,
    amount: string,
    sender: string,
    memo: string
  }

const SideBar = () => {
    const divRef = useRef(null)
    const account = useAccount();
    const sendNotification = useNotification();
    const [jwtClaim, setJwtClaim] = useState<string | undefined>(undefined);
    const [claimables, setClaimables] = useState<ClaimRow[]|undefined>(undefined);
    const [loading, setLoading] = useState(false);
    async function ReadClaimables() {
      try {
       //setClaimables()
      } catch (error) {
        // eslint-disable-next-line no-console -- No UI exists yet to display errors
        console.log(error);
      }
    }
    async function ClaimTokens() {
      event?.preventDefault();
      console.log("Claim Tokens")
      setLoading(true);
      try {
        if(true){
          sendNotification({msg:"Hey!!! Successfully Claimed all the tokens",variant:"success"});
        }
      } catch (error) {
        // eslint-disable-next-line no-console -- No UI exists yet to display errors
        console.log(error);
        sendNotification({msg:`Error Claiming token: ${error}`,variant:"error"});

      } finally {
        setLoading(false);
        ReadClaimables();
      }
    }
  
    useEffect(()=>{
      if(true)
        ReadClaimables();
    },[]);
    useEffect(()=>{
      console.log("JWT claim:",jwtClaim);
    },[jwtClaim]);
    useEffect(() => {
      if (divRef.current) {
        // @ts-ignore: Unreachable code error
        window.google.accounts.id.initialize({
          nonce: account!.address?.toString(),
          client_id:
            '226077901873-96cek128l90clri0i55c0ii88bjbcsge.apps.googleusercontent.com',
          // @ts-ignore: Unreachable code error
          callback: (res, error) => {
            console.log('res', res)
            console.log('error', error)
            if (!error) {
              setJwtClaim(res.credential)
            }
            // This is the function that will be executed once the authentication with google is finished
          }
        })
        // @ts-ignore: Unreachable code error
        window.google.accounts.id.renderButton(divRef.current, {
          theme: 'filled_blue',
          size: 'medium',
          type: 'standard',
          text: 'continue_with'
        })
      }
    }, [divRef.current])
  return (
    <div className="flex flex-col w-1/3 max-w-[25rem] h-dvh bg-[#ADE8F3]">
        <div className="flex flex-row items-center justify-start gap-2 p-5">
            <img src='/Wallet.svg' className="h-5 w-5"></img>
            <AddressViewer address = {account.isConnected? account!.address!.toString():""}></AddressViewer>
        </div>
        <div className="flex flex-row items-center justify-start gap-2 pl-5">
            <img src='/Email.svg' className="h-5 w-5"></img>
            {!jwtClaim && account.isConnected&& <div ref={divRef}/>}
        </div>
        <div className="bg-slate-600 h-0.5  m-5"></div>
        
        <div className="pl-5 pr-5 w-full justify-center items-center">
            {(claimables==undefined && account )&& <CircularProgress></CircularProgress>} {/* removed Email & client from Booleans*/}
            {(claimables && claimables.length==0)&&<NothingMessage></NothingMessage>}
            {(claimables && claimables.length>0)&&<div>
              <ClaimMessage></ClaimMessage>
              <div className='flex flex-col w-full pt-3  gap-2 '>
                  {claimables?.map((x,index) =>(<ClaimCard key={index} claimObject={x}></ClaimCard>))}
                  <div className="bg-slate-600 h-0.5  m-2"></div>
                  <div className="flex flex-row pl-4 pr-4">     
                      <a className="flex flex-row w-40">Total Value: </a>
                      <div className="flex flex-row-reverse w-full ">
                          <a className="font-bold "> {claimables?.reduce((accumulator, x)=>{return accumulator+(x.amount*x.price)},0)}$</a>
                      </div>
                  </div>
              </div>
            <form onSubmit={ClaimTokens} className='flex flex-row-reverse h-20 w-full pt-3 pb-3'>
                {!loading?<button disabled={loading|| !claimables || claimables.length<1} className="w-[150px] bg-sky-600 hover:bg-sky-500 disabled:bg-gray-500 disabled:text-slate-700  border-gray-500 text-white  rounded h-full text-xl font-bold" >Claim</button>:<CircularProgress></CircularProgress>}
            </form></div>}
        </div>
    </div>
  )
}

export default SideBar