
import { Network, Alchemy} from 'alchemy-sdk'

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
    apiKey: "uT32-cQ_Cns0riUDIkSyLuikSga4SAg4", // Replace with your Alchemy API Key.
    network: Network.BASE_SEPOLIA, // Replace with your network.
  };
  
  export const alchemy = new Alchemy(settings);