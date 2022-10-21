import './App.css';
import { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import { GearFill } from 'react-bootstrap-icons';
import ConnectButton from './components/ConnectButton';

import PageButton from './components/PageButton';
import ConfigModal from './components/ConfigModal';
import BeatLoader from 'react-spinners/BeatLoader'
import CurrencyField from './components/CurrencyField';

import { getWethContract, getUniContract, getPrice, runSwap } from './AlphaRouterService';

function App() {
  const [provider, setprovider] = useState(undefined)
  const [signer, setsigner] = useState(undefined)
  const [signerAddress, setsignerAddress] = useState(undefined)

  const [slippageAmount, setSlippageAmount] = useState(0.01)
  const [deadlineMinutes, setDeadlineMinutes] = useState(10)
  const [showModal, setShowModal] = useState(undefined)

  const [inputAmount, setInputAmount] = useState(undefined)
  const [outputAmount, setOutputAmount] = useState(undefined)
  const [transaction, setTransaction] = useState(undefined)
  const [loading, setLoading] = useState(undefined)
  const [ratio, setRatio] = useState(undefined)
  const [wethContract, setWethContract] = useState(undefined)
  const [uniContract, setUniContract] = useState(undefined)
  const [wethAmount, setWethAmount] = useState(undefined)
  const [uniAmount, setUniAmount] = useState(undefined)

useEffect(() => {
  const onload = async () => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum)
    setprovider(provider)

    const wethContract = getWethContract()
    setWethContract(wethContract)

    const uniContract = getUniContract()
    setUniContract(uniContract)
  }

  onload()
}, [])

const getSigner = async provider => {
  await provider.send("eth_requestAccounts", [])
  const signer = provider.getSigner()
  setsigner(signer)
  
}

const getWalletAddress = () => {
  
  signer.getAddress()
  .then(address => {
    setsignerAddress(address)
    console.log(address);
    wethContract.balanceOf(address)
    .then(res => {
      setWethAmount(Number(ethers.utils.formatEther(Number)))
    })

    uniContract.balanceOf(address)
    .then(res => {
      setUniAmount(Number(ethers.utils.formatEther(Number)))
    })
    
  })
}

if (signer != undefined) {
  
  getWalletAddress()
}

const isConnected = () => signer != undefined

const getSwapPrice = (inputAmount) => {
  setLoading(true)
  setInputAmount(inputAmount)

  const swap = getPrice(
    inputAmount,
    slippageAmount,
    Math.floor(Date.now()/1000 + (deadlineMinutes * 60)),
    signerAddress
  ).then(data => {
    setTransaction(data[0])
    setOutputAmount(data[1])
    setRatio(data[2])
    setLoading(false)
  })
}
 

  return (
    <div className="App">
      <div className='appNav'>

        <div className='my-2 buttonContainer buttonContainerTop'>
          <PageButton name={"Swap"} isBold={true} />
          <PageButton name={"Pool"} />
          <PageButton name={"Vote"} />
          <PageButton name={"Charts"} />
        </div>

        <div className='rightNav'>
          <div className='connectButtonContainer'>
              <ConnectButton
              provider={provider}
              isConnected={isConnected}
              signerAddress={signerAddress}
              getSigner={getSigner}
              />
          </div>
          <div className='my-2 buttonContainer'>
            <PageButton name={"..."} isBold={true} />
          </div>
        </div>
 
      </div>

      <div className='appBody'>
        <div className='swapContainer'>
          <div className='swapHeader'>
            <span className='swapText'>Swap</span>
            <span className='gearContainer' onClick={() => setShowModal(true)}>
              <GearFill/>
            </span>
            {showModal && (
              <ConfigModal
                onClose={() => setShowModal(false)}
                setDeadlineMinutes={setDeadlineMinutes}
                deadlineMinutes={deadlineMinutes}
                setSlippageAmount={setSlippageAmount}
                slippageAmount={slippageAmount} />
            )}
          </div>

          <div className='swapBody'>
              <CurrencyField
              field="input"
              tokenName="WETH"
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={wethAmount} />
            <CurrencyField
              field="output"
              tokenName="UNI"
              value={outputAmount}           
              signer={signer}
              balance={wethAmount}
              spinner={BeatLoader}
              loading={loading}
              />


          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
