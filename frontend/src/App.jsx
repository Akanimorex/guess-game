import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import abi from './abi/abi.js'
import Confetti from 'react-confetti'


// Modal Component
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg text-black text-2xl font-bold">
        {children}
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  );
}




function App() {
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState('');
  const [reveal, setReveal] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [celebrate, setCelebrate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const contractAddress="0x1f256e82f413c409bd66A58F7210C42F7F3FFadC"

  const account = useAccount();



  
  const {data:randomNumber,isSuccess,error} = useReadContract({
    address: contractAddress,
    abi:abi,
    functionName:'getRandomNumber',
    account: account.address,
  });

  const {writeContractAsync,isPending} = useWriteContract();


  const handleRefresh = async () => {
    try {
      
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: abi,
        functionName: "restartGame",
        account: account.address,
        args: [], 
      });
      
      console.log("tx happening::",tx);
      setTxHash(tx); 
    } catch (err) {
      console.error("Error creating invoice:", err);
    }
  };


  const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash: txHash,
  });



  useEffect(()=>{
    if(isConfirmed){
      console.log("transaction confirmed")
    }
  },[isConfirmed])

  

  useEffect(()=>{
    if(isSuccess){
      console.log(randomNumber,"call success")
      setResult(randomNumber)
    }else if (error){
      console.log(error,"error")
    }
  },[isSuccess,error,randomNumber])

  // console.log(randomNumber,"result")

  const handleGuess = () => {
    if(guess == result){
      console.log("Correct guess!!!");
      setCelebrate(true);
      setIsModalOpen(true);
    }else{

      console.log("try again next time");
      setCelebrate(false);
      setShowError(true);
    }
  }

  const handleReveal = () => {
    setReveal(true)
  }
       

  return (
    <>
    {celebrate && <Confetti />}
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold">Congratulations!</h2>
        <p>You guessed the correct number!</p>
    </Modal>
    <div className='h-screen w-full'>
      <div className='flex justify-between'>
        <h1>GUESS</h1>
        <ConnectButton />
      </div>

      <div className="min-h-screen flex items-center justify-center ">
        <div className="bg-black p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Guess the Number!</h1>

          <div className="mt-4">
            <input
              type="number"
              className="border p-2 rounded w-full"
              placeholder="Enter your guess"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
            />
            <div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full"
              onClick={handleGuess}
              >
              Submit Guess
            </button>
            {showError && (
              <div className="mt-4 p-2 bg-red-100 rounded">
                <p className="text-red-500 text-center">Incorrect guess, try again!</p>
              </div>
            )}            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full"
              disabled={isPending}
              onClick={handleRefresh}
            >
              {isPending?"Restarting...":"Restart Game"}
            </button>

            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full"
              onClick={handleReveal}
            >
              Reveal 
            </button>

            </div>
          </div>

          {result && (
            <div className="mt-4 p-2 bg-gray-100 rounded">
              <p className='text-center text-2xl font-bold text-black '>
                {reveal ? result.toString() : '???' }
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default App
