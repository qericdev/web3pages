import Head from "next/head";
import styles from "../styles/Whitelist.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  
  const table = [
    "./../images/cryptocurrencies/Bitcoin.svg","./../images/cryptocurrencies/DogeCoin.svg","./../images/cryptocurrencies/Decentraland.svg","./../images/cryptocurrencies/Ethereum.svg","./../images/cryptocurrencies/Kadena.svg","./../images/cryptocurrencies/Polygon.svg","./../images/cryptocurrencies/ShibaInu.svg","./../images/cryptocurrencies/Solana.svg","./../images/cryptocurrencies/Tether.svg","./../images/cryptocurrencies/Zilliqa.svg"
  ];

  const [slotOne, setSlotOne] = useState(0);
  const [slotTwo, setSlotTwo] = useState(1);
  const [slotThree, setSlotThree] = useState(2);
  const [runSlot, setRunSlot] = useState(false);
  const [counter, setCounter] = useState(0);
  const [maxRunsFirstSlot, setMaxRunsFirstSlot] = useState(0);
  const [maxRunsSecondSlot, setMaxRunsSecondSlot] = useState(0);
  const [maxRunsThirdSlot, setMaxRunsThirdSlot] = useState(0);
  const [attempsLeft, setAttempsLeft] = useState(3);
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
              setTokensEarned(prevTokensEarned => prevTokensEarned + 3000);
            }
            else {
              if((table[(slotOne+1)%10] === table[(slotTwo+1)%10] || table[(slotTwo+1)%10] === table[(slotThree+2)%10] || table[(slotOne+1)%10] === table[(slotThree+2)%10])) {
                setTokensEarned(prevTokensEarned => prevTokensEarned + 1000);
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
        WHITELIST_CONTRACT_ADDRESS,
        abi,
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
        WHITELIST_CONTRACT_ADDRESS,
        abi,
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
        WHITELIST_CONTRACT_ADDRESS,
        abi,
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
        WHITELIST_CONTRACT_ADDRESS,
        abi,
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
            Thanks for joining the Whitelist!
            <p>We have reserved <span className={styles.emphasis}>{tokensEarnedFinal}</span> Habit Tokens for you. Distribution on June 15.</p>
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
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
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Ha-Bit Whitelist!</h1>
          <div className={styles.description}>
            <p>Win free Habit Tokens and a Spot in our next ICO. Only first 250 participants.</p>
            <p>How to participate?</p>
            <ol>
              <li>Connect your Wallet (Polygon Network).</li>
              <li>Play the Slot Machine to win Habit Tokens. You have 3 chances.</li>
              <li>Click on Join The Whitelist.</li>
              <li>Wait for confirmation.</li>
              <li>Refresh page.</li>
              <li>Share pinned post on <a className={styles.emphasis} href="https://twitter.com/habitweb3" target="_blank">Twitter</a> and join our <a className={styles.emphasis} href="https://t.me/habitweb3ann" target="_blank">Telegram Channel</a> to participate in a draw for 50 Matic Coins.</li>
            </ol>
          </div>
          <div className={styles.description}>
            <span className={styles.emphasis}>{numberOfWhitelisted} /250 </span> have already joined the Whitelist and won Habit Tokens!
          </div>
          {renderButton()}
        </div>
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

      <footer className={styles.footer}>
        Ha-Bit Web3. Build a habit and earn rewards.
      </footer>
    </div>
  );
}

