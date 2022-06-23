import { BigNumber, Contract, providers, utils } from "ethers";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import {
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";
import styles from "../styles/Ico.module.css";

export default function Home() {


    const table = [
        "./../images/cryptocurrencies/Bitcoin.svg","./../images/cryptocurrencies/Curve.svg","./../images/cryptocurrencies/Coingecko.svg","./../images/cryptocurrencies/Ethereum.svg","./../images/cryptocurrencies/Metamask.svg","./../images/cryptocurrencies/Chainlink.svg","./../images/cryptocurrencies/ShibaInu.svg","./../images/cryptocurrencies/Solana.svg","./../images/cryptocurrencies/Binance.svg","./../images/cryptocurrencies/Cardano.svg"
      ];
    
      const [slotOne, setSlotOne] = useState(0);
      const [slotTwo, setSlotTwo] = useState(1);
      const [slotThree, setSlotThree] = useState(2);
      const [runSlot, setRunSlot] = useState(false);
      const [counter, setCounter] = useState(0);
      const [maxRunsFirstSlot, setMaxRunsFirstSlot] = useState(0);
      const [maxRunsSecondSlot, setMaxRunsSecondSlot] = useState(0);
      const [maxRunsThirdSlot, setMaxRunsThirdSlot] = useState(0);
      const [attempsLeft, setAttempsLeft] = useState(5);
      const [account, setAccount] = useState(""); 
      const [tokensEarned, setTokensEarned] = useState(0);
      const [tokensEarnedFinal, setTokensEarnedFinal] = useState(0);
      const [disabledBut, setDisabledBut] = useState(false);
    
      useEffect(() => {
          if(maxRunsFirstSlot === 0) {
              setMaxRunsFirstSlot(Math.floor(Math.random() * 10) + 40);
          };
          if(maxRunsSecondSlot === 0) {
              setMaxRunsSecondSlot(Math.floor(Math.random() * 10) + 70);
          }
          if(maxRunsThirdSlot === 0) {
              setMaxRunsThirdSlot(Math.floor(Math.random() * 10) + 100);
          }
      },[maxRunsFirstSlot,maxRunsSecondSlot,maxRunsThirdSlot]);
    
      useEffect(() => {
        if(counter < maxRunsFirstSlot && runSlot) {
          setTimeout(function() {
            setSlotOne(prevSlotOne => prevSlotOne + 1);
            setCounter(prevCounter => prevCounter + 1);
          },50);
        }
    
        if(counter < maxRunsSecondSlot && runSlot) {
          setTimeout(function() {
            setSlotTwo(prevSlotTwo => prevSlotTwo + 1);
            if(counter >= maxRunsFirstSlot) {
                setCounter(prevCounter => prevCounter + 1);
            }
          },50);
        }
    
        if(counter < maxRunsThirdSlot && runSlot) {
            setTimeout(function() {
              setSlotThree(prevSlotThree => prevSlotThree + 1);
              if(counter >= maxRunsSecondSlot) {
                setCounter(prevCounter => prevCounter + 1);
              }
              // Number 2 on Table Three means that when SlotThree is updated, this updated value is not evaluated by conditional
              if(maxRunsThirdSlot - counter === 1) {   
                if(table[(slotOne+1)%10] === table[(slotTwo+1)%10] && table[(slotOne+1)%10] === table[(slotThree+2)%10]) {
                  setTokensEarned(prevTokensEarned => prevTokensEarned + 1000);
                }
                else {
                  if((table[(slotOne+1)%10] === table[(slotTwo+1)%10] || table[(slotTwo+1)%10] === table[(slotThree+2)%10] || table[(slotOne+1)%10] === table[(slotThree+2)%10])) {
                    setTokensEarned(prevTokensEarned => prevTokensEarned + 300);
                  }
                }
              }
            },50);
        }
    
          if(counter === maxRunsThirdSlot && runSlot && maxRunsFirstSlot !== 0 && attempsLeft > 0) {
              setMaxRunsFirstSlot(0);
              setMaxRunsSecondSlot(0);
              setMaxRunsThirdSlot(0);
              setCounter(0);
              setRunSlot(prevRunSlot => !prevRunSlot);
          }
    
      },[runSlot, counter]);
    
        function pullTheLever() {
            setRunSlot(prevRunSlot => !prevRunSlot);
            if(attempsLeft >= 0) {
                setAttempsLeft(prevAttempsLeft => prevAttempsLeft - 1);
            }
        }

  const zero = BigNumber.from(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [balanceOfCryptoDevTokens, setBalanceOfCryptoDevTokens] = useState(
    zero
  );
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(zero);
  const [tokensMinted, setTokensMinted] = useState(zero);
  const web3ModalRef = useRef();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes]= useState(0);
  const [seconds, setSeconds] = useState(0);


  const getBalanceOfCryptoDevTokens = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();
      const balance = await tokenContract.balanceOf(address);
      setBalanceOfCryptoDevTokens(balance);
    } catch (err) {
      console.error(err);
      setBalanceOfCryptoDevTokens(zero);
    }
  };


  const presaleMint = async (amount) => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );
      const value = 0.001 * amount;
      const tx = await tokenContract.presaleMint(amount, {
        value: utils.parseEther(value.toString()),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("Sucessfully minted Habit Tokens");
      setDisabledBut(prevDisabledBut => !prevDisabledBut);
      await getBalanceOfCryptoDevTokens();
      await getTotalTokensMinted();
    } catch (err) {
      console.error(err);
    }
  };

  const mintCryptoDevToken = async (amount) => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );
      const value = 0.001 * amount;
      const tx = await tokenContract.mint(amount, {
        value: utils.parseEther(value.toString()),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("Sucessfully minted Tokens");
      setDisabledBut(prevDisabledBut => !prevDisabledBut);
      await getBalanceOfCryptoDevTokens();
      await getTotalTokensMinted();
    } catch (err) {
      console.error(err);
    }
  };

  const getTotalTokensMinted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );

      const _tokensMinted = await tokenContract.totalSupply();
      setTokensMinted(_tokensMinted);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const startPresale = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );
      const tx = await tokenContract.startPresale();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await checkIfPresaleStarted();
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider);
      const _presaleStarted = await tokenContract.presaleStarted();
      if (!_presaleStarted) {
        await getOwner();
      }
      setPresaleStarted(_presaleStarted);
      return _presaleStarted;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const checkIfPresaleEnded = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider);
      const _presaleEnded = await tokenContract.presaleEnded();
      const hasEnded = _presaleEnded.lt(Math.floor(Date.now() / 1000));
      if (hasEnded) {
        setPresaleEnded(true);
      } else {
        setPresaleEnded(false);
      }
      return hasEnded;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getOwner = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider);
      const _owner = await tokenContract.owner();
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();
      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 137) {
      window.alert("Change the network to Polygon");
      throw new Error("Change network to Polygon");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };


  useEffect(() => {
    
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "matic",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      const _presaleStarted = checkIfPresaleStarted();
      if (_presaleStarted) {
        checkIfPresaleEnded();
      }
      getTotalTokensMinted();

      const presaleEndedInterval = setInterval(async function () {
        const _presaleStarted = await checkIfPresaleStarted();
        if (_presaleStarted) {
          const _presaleEnded = await checkIfPresaleEnded();
          if (_presaleEnded) {
            clearInterval(presaleEndedInterval);
          }
        }
      }, 5 * 1000);

      setInterval(async function () {
        await getTotalTokensMinted();
      }, 5 * 1000);
    }
  }, [walletConnected]);


  const renderButton = () => {

    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
    
    if (loading) {
      return (
        <div>
          <button className={styles.button}>Loading...</button>
        </div>
      );
    }

    if (isOwner && !presaleStarted) {
     
      return (
        <button className={styles.button} onClick={startPresale}>
          Start Presale!
          
        </button>
      );
    }

    if (!presaleStarted) {
      return (
        <div>
          <div className={styles.description}><span className={styles.emphasis}>Presale has not started!</span></div>
        </div>
      );
    }

    if (presaleStarted && !presaleEnded) {
      return (
        <div>
          <div className={styles.description}>
            ICO has started!!! If your address is whitelisted, Mint Tokens 🥳
          </div>
          <div style={{ display: "flex-col" }}>
        <div>
          <input
            type="number"
            placeholder="Amount of Tokens"
            onChange={(e) => setTokenAmount(BigNumber.from(e.target.value*1000))}
            className={styles.input}
          />
        </div>

        <button
          className={styles.button}
          disabled={!(tokenAmount > 0)}
          onClick={() => presaleMint(tokenAmount)}
        >
          PreSale Mint 🚀
        </button>
      </div>
        
        </div>
      );
    }

    // If presale started and has ended, its time for public minting
    if (presaleStarted && presaleEnded) {
      return (
        <div>
        <div style={{ display: "flex-col" }}>
        <div className={styles.desctokens}>
          <p>Min: 40 Matic - Max: 3200 Matic.</p>
          <p> You will receive {tokenAmount*1} Tokens </p>
          <input
            type="number"
            placeholder="Amount of Matic Tokens"
            onChange={(e) => setTokenAmount(BigNumber.from(e.target.value*1000))}
            className={styles.input}
          />
        </div>

        <button
          className={styles.button}
          disabled={!(tokenAmount > 0)}
          onClick={() => mintCryptoDevToken(tokenAmount)}
        >
          Mint Tokens
        </button>
      </div>
        
        </div>
      );
    }
    
  }

  useEffect(()=> {
    function countdown() {
      let countDownDate = new Date("July 18, 2023 11:00:00").getTime();

      let x = setInterval(function() {
        let now = new Date().getTime();
        let distance = countDownDate - now;
    
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setDays(days);
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
      
        if (distance < 0) {
          clearInterval(x);
        }
      }, 1000);
    }

    countdown();
  },[days, hours, minutes, seconds])
 
  return (
    <div>
      <Head>
        <title>ICO Event</title>
        <meta name="description" content="ICO-Dapp" />
        <link rel="icon" href="/7.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>ICO Event</h1>
          <div className={styles.description}>
            <table className={styles.table}>
              <tbody>
              <tr><th>Event</th><th>Date</th></tr>
              <tr><td>ICO Event</td><td>July 20</td></tr>
              <tr><td>Token Fair Launch</td><td>July 27</td></tr>
              </tbody>
            </table>
            
            <p>Unlock the Premium Slot Machine and <span className={styles.emphasis}>win one of the NFTs </span>and Prizes increased!(Only 2000 Spots).</p>
            <ol>
                <li>Connect your Wallet (Polygon Network).</li>
                <li>Enter the amount of Matics to use and clic on Mint Tokens.</li>
                <li>Unlock access to the <span className={styles.emphasis}>Slot Machine</span>.</li>
            </ol>
          </div>
          
            <div>
              <div className={styles.description}>
               
              </div>
              <div className={styles.description}>
                {/* Format Ether helps us in converting a BigNumber to string */}
                Overall <span className={styles.emphasis}>{utils.formatEther(tokensMinted)}/150'000,000</span> have been minted!!!
              </div>
              {renderButton()}
            </div>
          
        </div>
        <div>
        <div className={styles.slotMachineGlobal}>
            <div className={styles.slotMachine}>
                <section className={styles.slots}>
                    <div><img src={table[(slotOne)%10]}/></div>
                    <div><img src={table[(slotTwo)%10]}/></div>
                    <div><img src={table[(slotThree)%10]}/></div>
                </section>
                <section className={`${styles.slots} ${styles.slotCentral}`}>
                    <div><img src={table[(slotOne+1)%10]}/></div>
                    <div><img src={table[(slotTwo+1)%10]}/></div>
                    <div><img src={table[(slotThree+1)%10]}/></div>
                </section>
                <section className={styles.slots}>
                    <div><img src={table[(slotOne+2)%10]}/></div>
                    <div><img src={table[(slotTwo+2)%10]}/></div>
                    <div><img src={table[(slotThree+2)%10]}/></div>
                </section>
            </div>
            <div className={styles.slotMachineBoard}>
                <img style={{pointerEvents: runSlot ? 'none': 'auto'}} src="./../images/cryptocurrencies/pushbutton.svg"/>

                <div>
                    Tokens: {tokensEarned}
                </div>
                <div>
                    Left: {attempsLeft > 0 ? attempsLeft : 0}
                </div>
                <div className={styles.instructions}>
                    Follow the instructions to count valid plays
                </div>
            </div>

        </div>
        <div className={styles.countdown}>{days}d : {hours}h : {minutes}m : {seconds}s</div>
        <div className={styles.buttonUnlock}>
          <Link href="/premiumslot9357"><a><button style={{display:disabledBut?'block':'none'}} className={styles.buttonTwo}>Unlock Machine Slot</button></a></Link>
        </div>
        </div>
      </div>
      <div className={styles.bigslot}>
          <h2>Prizes Premium Machine Slot (Prizes Increased)</h2>
          <p><span className={styles.emphasis}>Access to the Premium Machine Slot is unlocked by participating in the ICO event.</span></p>
          <div>
            <p>Whoever participates in the Premium Machine Slot earn a  one of forty <span className={styles.emphasis}>NFT Genesis Edition</span> and gain access to the draw for <span className={styles.emphasis}>30 Matic Coins.</span></p>
            <div className={styles.cardsNFT}>
            <section className={styles.cards}>
              <div className={`${styles.card} ${styles.charizard} ${styles.animated}`}></div>
              <div className={`${styles.card} ${styles.pika} ${styles.animated}`}></div>
              <div className={`${styles.card} ${styles.eevee} ${styles.animated}`}></div>
            </section>
            </div>
            <p>Two in a row <img src="./../images/cryptocurrencies/Coingecko.svg"/><img src="./../images/cryptocurrencies/Solana.svg"/><img src="./../images/cryptocurrencies/Solana.svg"/>: 300 Tokens</p>
            <p>Three in a row <img src="./../images/cryptocurrencies/Bitcoin.svg"/><img src="./../images/cryptocurrencies/Bitcoin.svg"/><img src="./../images/cryptocurrencies/Bitcoin.svg"/>: 1000 Tokens </p>
             
          </div>

      <div className={styles.slotMachineGlobal}>
            <div className={styles.slotMachine}>
                <section className={styles.slots}>
                    <div><img src="./../images/cryptocurrencies/Coingecko.svg"/></div>
                    <div><img src="./../images/cryptocurrencies/Binance.svg"/></div>
                    <div><img src="./../images/cryptocurrencies/Cardano.svg"/></div>
                </section>
                <section className={`${styles.slots} ${styles.slotCentral}`}>
                    <div><img src="./../images/cryptocurrencies/Chainlink.svg"/></div>
                    <div><img src="./../images/cryptocurrencies/Coinbase.svg"/></div>
                    <div><img src="./../images/cryptocurrencies/Curve.svg"/></div>
                </section>
                <section className={styles.slots}>
                    <div><img src="./../images/cryptocurrencies/Dogecoin.svg"/></div>
                    <div><img src="./../images/cryptocurrencies/Ethereum.svg"/></div>
                    <div><img src="./../images/cryptocurrencies/Solana.svg"/></div>
                </section>
            </div>
            <div className={styles.slotMachineBoard}>
                <img style={{pointerEvents: runSlot ? 'none': 'auto'}} src="./../images/cryptocurrencies/pushbutton.svg"/>

                <div>
                    Tokens: {tokensEarned}
                </div>
                <div>
                    Left: {attempsLeft > 0 ? attempsLeft : 0}
                </div>
                <div className={styles.instructions}>
                    Follow the instructions to count valid plays
                </div>
            </div>
            
        </div>
       
      </div>

      <footer className={styles.footer}>
          Join today - Web3 Project
      </footer>
    </div>
  );
}