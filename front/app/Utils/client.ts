import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { createConfig } from 'wagmi'
 
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
})
export const simulateConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
})