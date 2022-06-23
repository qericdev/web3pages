import Head from "next/head";
import Link from "next/link";
import Memory from "./components/memory"
import styles from "../styles/Airdrop.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { EVENT_CONTRACT_ADDRESS, EVENT_ABI } from "../constants";

export default function Airdrop() {
  
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
        EVENT_CONTRACT_ADDRESS,
        EVENT_ABI,
        signer
      );

      const tx = await whitelistContract.addAddressToWhitelist(100);
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
        EVENT_CONTRACT_ADDRESS,
        EVENT_ABI,
        provider
      );

      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        EVENT_CONTRACT_ADDRESS,
        EVENT_ABI,
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
    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Event!
            <p>We have reserved <span className={styles.emphasis}>100</span> Tokens for you. Distribution on July 30.</p>
            <Link href="./ico"><a><p className={styles.emphasisButton}>Access to ICO Event Unlocked</p></a></Link>
          </div>
          
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } 
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
        <title>Aidrop And ICO Event</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/7.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}><span className={styles.emphasis}>You have found a Hidden Gem!</span></h1>
          <div className={styles.description}>
            <p>Win Tokens solving this memory game. Only first 4000 participants.</p>
            <table className={styles.table}>
              <tbody>
              <tr><th>Event</th><th>Date</th></tr>
              <tr><td>Airdrop</td><td>June 18</td></tr>
              <tr><td>ICO Event</td><td>June 18</td></tr>
              <tr><td>Token Fair Launch</td><td>June 21</td></tr>
              </tbody>
            </table>
            <p><span className={styles.emphasis}></span>How to participate?  </p>
            
            <ol>
              <li>Connect your Wallet (Polygon Network).</li>
              <li>Solve the Ha-Bit Memory Game Challenge.</li>
              <li>Click on Join Button.</li>
              <li>Wait for Confirmation</li>
              <li>Clic on <span className={styles.emphasis}>Access to ICO Event Unlocked</span> if you want to win one of the origin NFTs.</li>
            </ol>
          </div>
          <div className={styles.description}>
            <span className={styles.emphasis}>{numberOfWhitelisted} / 3000 </span> have already joined the event and Won Tokens!
          </div>
          {renderButton()}
        </div>
        <div className={styles.rightSection}>
          <Memory walletConnected={walletConnected} connectWallet={connectWallet} joinedWhitelist={joinedWhitelist} addAddressToWhitelist={addAddressToWhitelist}/>
          
        </div>
      </div>
      <div className={styles.bigslot}>
       
        <div className={styles.cardsNFT}>
            <section className={styles.cards}>
              <div className={`${styles.card} ${styles.charizard} ${styles.animated}`}></div>
              <div className={`${styles.card} ${styles.pika} ${styles.animated}`}></div>

            </section>
          </div>
      </div>
      

      <footer className={styles.footer}>
        Be part of this web3 project.
      </footer>
    </div>
  );
}

