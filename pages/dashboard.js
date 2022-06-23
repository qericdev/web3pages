import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Dashboard.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { AIRDROPONE_CONTRACT_ADDRESS, AIRDROPONE_ABI } from "../constants";
import {dataAirdropOne} from "../constants/dataAirdropTwo";


export default function Home() {

    const [participants, setParticipants] = useState("");
    const [walletConnected, setWalletConnected] = useState(false);
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

    const getNumberOfTokensEarned = async() => {


        const provider = await getProviderOrSigner();

        const airdropContract = new Contract(
            AIRDROPONE_CONTRACT_ADDRESS,
            AIRDROPONE_ABI,
            provider
        );
        
        const participantsAirdropOne = "";

        for(let i = 0; i < dataAirdropOne.length; i++) {
            const _numTokensEarned = await airdropContract.numTokensEarned(dataAirdropOne[i]);
            participantsAirdropOne += `<tr><td>${dataAirdropOne[i]}</td><td>${_numTokensEarned}</td></tr>`
        }
        setParticipants(participantsAirdropOne);
    }


    const connectWallet = async () => {
        try {
          await getProviderOrSigner();
          setWalletConnected(true);
        } catch (err) {
          console.error(err);
        }
      };


      useEffect(() => {

        if (!walletConnected) {
          web3ModalRef.current = new Web3Modal({
            network: "matic",
            providerOptions: {},
            disableInjectedProvider: false,
          });
          connectWallet();
        }
      }, [walletConnected]);

    return(
        <div className={styles.main}>

            <div> <table dangerouslySetInnerHTML={{ __html: participants }} /></div>
            <button onClick={getNumberOfTokensEarned}>Get Participants</button>
        </div>
    );
}