import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BlackCreateWalletButton } from './BlackCreateWalletButton';
import { useAccount } from 'wagmi';

const NavBar = () => {
  const account = useAccount();
  return (
    <nav className='flex space-x-6 px-8 h-16 items-center bg-gradient-to-l from-[#65CADA] to-[#97DFEB]/60 shadow backdrop-blur-sm' >
        <div className='flex flex-row items-center space-x-2'>
          <img src={"/logo.svg"} className='w-9 h-9'/>
          <a href={"/"} className="text-black text-2xl font-bold"> HeyPay</a>
        </div>
        <ul className='flex space-x-6'>
        </ul>
        <div className=' w-full flex '></div>
        <div className='flex flex-row-reverse p-6 gap-2'>
         {!account.isConnected &&<BlackCreateWalletButton></BlackCreateWalletButton>}

          <ConnectButton></ConnectButton>
          {/* <button
           className='color-w'
          >
            <div className=" pl-5 pr-5 pt-1 pb-1 hover:bg-[#ADE8F3] justify-center align-middle border-2 rounded-lg border-[#2D3D50] text-[#2D3D50]">
              {account.isConnected ? ("Logout") : (
                "CONNECT"
              )}
            </div>
          </button> */}
        </div>
    </nav>
  )
}

export default NavBar