import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Premium.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { PREMIUM_CONTRACT_ADDRESS, PREMIUM_ABI } from "../constants";

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

  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const web3ModalRef = useRef();

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

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        PREMIUM_CONTRACT_ADDRESS,
        PREMIUM_ABI,
        signer
      );

      const tx = await whitelistContract.addAddressToWhitelist(tokensEarned);
      setLoading(true);

      await tx.wait();
      setLoading(false);

      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {

      const provider = await getProviderOrSigner();

      const whitelistContract = new Contract(
        PREMIUM_CONTRACT_ADDRESS,
        PREMIUM_ABI,
        provider
      );

      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  const getTokensEarned = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        PREMIUM_CONTRACT_ADDRESS,
        PREMIUM_ABI,
        signer
      );

      const address = await signer.getAddress();
      const _tokensEarned = await whitelistContract.numTokensEarned(
        address
      );
      setTokensEarnedFinal(_tokensEarned);

    } catch(err) {
      console.error(err);
    }
  }

  const checkIfAddressInWhitelist = async () => {
    try {

      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        PREMIUM_CONTRACT_ADDRESS,
        PREMIUM_ABI,
        signer
      );

      const address = await signer.getAddress();

      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {

      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
      getTokensEarned();
    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Premium Event!
            <p>We have reserved <span className={styles.emphasis}>{tokensEarnedFinal}</span> Tokens and you are participating in the draw for a Genesis NFT. Distribution on July 21.</p>
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Event
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };


  useEffect(() => {

    if (!walletConnected) {
      
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Slot Machine Event</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/7.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}><span className={styles.emphasis}>Slot Machine!</span></h1>
          <div className={styles.description}>
            <p>To participate please follow the steps below and you can win <span className={styles.emphasis}>a Genesis NFT, increased prizes and matic coins.</span></p>
            <p>How to participate?</p>
            <ol>
              <li>Connect your Wallet (Polygon Network).</li>
              <li>Play the Slot Machine to win Tokens (Click on Push Button). You have 5 chances.</li>
              <li>Join the Event.</li>
              <li>Wait for confirmation.</li>
              <li>Refresh page.</li>
            </ol>
          </div>
          <div className={styles.description}>
            <span className={styles.emphasis}>{numberOfWhitelisted} /2000 </span> have already joined the event to get NFTs, more Tokens and Matic Coins!
          </div>
          {renderButton()}
        </div>
        <div className={styles.rightSection}>
            
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
                    <img style={{pointerEvents: runSlot ? 'none': 'auto'}}onClick={pullTheLever} src="./../images/cryptocurrencies/pushbutton.svg"/>

                    <div>
                        Tokens: {tokensEarned}
                    </div>
                    <div>
                        Left: {attempsLeft > 0 ? attempsLeft : 0}
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <footer className={styles.footer}>
        Join today!
      </footer>
    </div>
  );
}

