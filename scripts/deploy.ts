import { ethers, run, network } from 'hardhat'

async function main() {
   const simpleStorageFactory = await ethers.getContractFactory('SimpleStorage')
   console.log('Deploying contract...')
   const simpleStorage = await simpleStorageFactory.deploy()
   await simpleStorage.deployed()

   if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
      await simpleStorage.deployTransaction.wait(6)
      await verify(simpleStorage.address, [])
   }

   console.log('SimpleStorage deployed to:', simpleStorage.address)

   let currentValue = await simpleStorage.retrieve()
   console.log(`Current value: ${currentValue}`)

   console.log('Updating contract...')
   const transactionResponse = await simpleStorage.store(6)
   await transactionResponse.wait()
   currentValue = await simpleStorage.retrieve()
   console.log(`Current value: ${currentValue}`)
}

async function verify(contractAddress: string, args: any[]) {
   console.log('Veryfying contract...')

   try {
      await run('verify:verify', {
         address: contractAddress,
         constructorArguments: args,
      })
   } catch (error: any) {
      if (error.message.toLowerCase().includes('already verified')) {
         console.log('Already verified!')
      } else {
         console.log(error)
      }
   }
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error)
      process.exitCode = 1
   })
