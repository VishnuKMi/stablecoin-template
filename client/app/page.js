'use client'

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/constants'

const page = () => {
  const [totalSupply, setTotalSupply] = useState(0)
  const [depositVal, setDepositVal] = useState('')
  const [redeemVal, setRedeemVal] = useState('')

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

  const fetchTotalSupply = async () => {
    const supply = await contract.totalSupply()
    const adjustedSupply = ethers.utils.formatUnits(supply, 18) // Adjust decimal places
    setTotalSupply(adjustedSupply)
  }

  useEffect(() => {
    fetchTotalSupply()
  }, [])

  const handleDeposit = async () => {
    if (depositVal) {
      const ethAmount = ethers.utils.parseEther(depositVal)
      await contract.deposit({ value: ethAmount })
      setDepositVal('')
      fetchTotalSupply()
    }
  }

  const handleRedeem = async () => {
    if (redeemVal) {
      const nusdAmount = ethers.utils.parseUnits(redeemVal, 18)
      await contract.redeem(nusdAmount)
      setRedeemVal('')
      fetchTotalSupply()
    }
  }

  return (
    <div>
      <div className='w-11/12 mx-auto my-8 flex items-center justify-center relative text-black font-bold'>
        <div className='mt-20 bg-yellow-400 p-4 rounded-lg w-[480px]'>
          <div className='flex justify-between'>
            <div>TOTAL SUPPLY (In nUSD)</div>
            <div>{totalSupply}</div>
          </div>
        </div>
      </div>
      <div className='w-11/12 mx-auto flex items-center justify-center relative text-black font-bold'>
        <div className='bg-yellow-400 rounded-lg p-4 w-[480px] space-y-8'>
          <div className='flex justify-around'>
            <button
              onClick={handleDeposit}
              className='bg-gray-400 hover:bg-gray-300 p-2 px-4 rounded-lg'
            >
              DEPOSIT
            </button>
            <input
              type='number'
              placeholder='value in ETH'
              className='placeholder-gray-600 bg-transparent border-2 border-black rounded-lg'
              value={depositVal}
              onChange={e => setDepositVal(e.target.value)}
            />
          </div>
          <div className='flex justify-around'>
            <button
              onClick={handleRedeem}
              className='bg-gray-400 hover:bg-gray-300 p-2 px-4 rounded-lg'
            >
              REDEEM
            </button>
            <input
              type='number'
              placeholder='value in ETH'
              className='placeholder-gray-600 bg-transparent border-2 border-black rounded-lg'
              value={redeemVal}
              onChange={e => setRedeemVal(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
