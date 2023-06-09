import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SimpleStorage, SimpleStorage__factory } from '../typechain-types'

describe('SimpleStorage', function () {
   let simpleStorageFactory: SimpleStorage__factory
   let simpleStorage: SimpleStorage

   beforeEach(async function () {
      simpleStorageFactory = (await ethers.getContractFactory(
         'SimpleStorage'
      )) as SimpleStorage__factory
      simpleStorage = await simpleStorageFactory.deploy()
   })

   it('Should start with a favorite number of 0', async function () {
      const currentFavouriteNumber = await simpleStorage.retrieve()
      expect(currentFavouriteNumber).to.equal(0)
   })

   it('Should update when we call store', async function () {
      const favouriteNumber = 6
      const transactionResponse = await simpleStorage.store(favouriteNumber)
      await transactionResponse.wait()

      const updatedFavouriteNumber = await simpleStorage.retrieve()
      expect(updatedFavouriteNumber).to.equal(favouriteNumber)
   })

   it('Should add person and favourite number', async function () {
      const favouriteNumber = 6
      const personName = 'John'

      const transactionResponse = await simpleStorage.addPerson(
         personName,
         favouriteNumber
      )
      await transactionResponse.wait()

      const johnArr = await simpleStorage.people(0)
      const johnFavouriteNumber = await simpleStorage.nameToFavoriteNumber(
         personName
      )

      expect(johnArr['favoriteNumber']).to.equal(favouriteNumber)
      expect(johnFavouriteNumber).to.equal(favouriteNumber)
   })
})
