import './App.css';
import { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import PageButton from './components/PageButton';
import ConnectButton from './components/ConnectButton';
import { GearFill } from 'react-bootstrap-icons';
import ConfigModal from './components/ConfigModal';


function App() {
  const [provider, setprovider] = useState(undefined)
  const [signer, setsigner] = useState(undefined)
  const [signerAddress, setsignerAddress] = useState(undefined)

  const [slippageAmount, setSlippageAmount] = useState(0.01)
  const [deadlineMinutes, setDeadlineMinutes] = useState(10)
  const [showModal, setShowModal] = useState(undefined)

useEffect(() => {
  const onload = async () => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum)
    setprovider(provider)
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
  })
}

if (signer != undefined) {
  getWalletAddress()
}

const isConnected = () => signer != undefined


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
        </div>
      </div>
    </div>
  );
}

export default App;
