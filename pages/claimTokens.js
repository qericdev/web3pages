import styles from './../styles/Claim.module.css';
import Head from 'next/head';
import {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import { WHITELIST_CONTRACT_ADDRESS, abi } from "./../constants";

export default function claimTokens() {

    const tableOne = [
        "./../images/cryptocurrencies/Bitcoin.svg","./../images/cryptocurrencies/DogeCoin.svg","./../images/cryptocurrencies/Decentraland.svg","./../images/cryptocurrencies/Ethereum.svg","./../images/cryptocurrencies/Kadena.svg","./../images/cryptocurrencies/Pancakeswap.svg","./../images/cryptocurrencies/ShibaInu.svg","./../images/cryptocurrencies/Solana.svg","./../images/cryptocurrencies/Tether.svg","./../images/cryptocurrencies/Zilliqa.svg"
    ];
    const tableTwo = [
        "./../images/cryptocurrencies/Bitcoin.svg","./../images/cryptocurrencies/DogeCoin.svg","./../images/cryptocurrencies/Decentraland.svg","./../images/cryptocurrencies/Ethereum.svg","./../images/cryptocurrencies/Kadena.svg","./../images/cryptocurrencies/Pancakeswap.svg","./../images/cryptocurrencies/ShibaInu.svg","./../images/cryptocurrencies/Solana.svg","./../images/cryptocurrencies/Tether.svg","./../images/cryptocurrencies/Zilliqa.svg"
    ];
    const tableThree = [
        "./../images/cryptocurrencies/Bitcoin.svg","./../images/cryptocurrencies/DogeCoin.svg","./../images/cryptocurrencies/Decentraland.svg","./../images/cryptocurrencies/Ethereum.svg","./../images/cryptocurrencies/Kadena.svg","./../images/cryptocurrencies/Pancakeswap.svg","./../images/cryptocurrencies/ShibaInu.svg","./../images/cryptocurrencies/Solana.svg","./../images/cryptocurrencies/Tether.svg","./../images/cryptocurrencies/Zilliqa.svg"
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

        if(counter < maxRunsFirstSlot && runSlot) {
            setTimeout(function() {
                setSlotOne(prevSlotOne => prevSlotOne + 1);
                setCounter(prevCounter => prevCounter + 1);
            },200);
        }

        if(counter < maxRunsSecondSlot && runSlot) {
            setTimeout(function() {
                setSlotTwo(prevSlotTwo => prevSlotTwo + 1);
                if(counter >= maxRunsFirstSlot) {
                    setCounter(prevCounter => prevCounter + 1);
                }
            },200);
        }

        if(counter < maxRunsThirdSlot && runSlot) {
            setTimeout(function() {
                setSlotThree(prevSlotThird => prevSlotThird + 1);
                if(counter >= maxRunsSecondSlot) {
                setCounter(prevCounter => prevCounter + 1);
                }
            },200);
        }

        if(counter >= maxRunsThirdSlot && !runSlot && maxRunsFirstSlot !== 0 && attempsLeft >= 0) {
            console.log(attempsLeft);
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

    async function loginMetamask() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        setAccount(accounts);
    }

    async function addAddressToWhitelist() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner();
            const whitelistContract = new ethers.Contract(WHITELIST_CONTRACT_ADDRESS,abi,signer);
            const tx = await whitelistContract.addAddressToWhitelist(tokensEarned);
            await tx.wait();
            setTokensEarned(1);

        } catch (err) {
            console.error(err);
        }
    }



    return(
        <>

        <div className={styles.container}>

            <Head>
            <title>HA-BIT Contest</title>
            <meta name="description" content="Habit Tracker powered by Blockchain Technology." />
            <link rel="icon" href="/favicon.ico" />
            <style>
            @import url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;1,300&display=swap");
            </style>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>

            <header>
                <h1>Ha-Bit Contest!</h1>
                <h2>Register free, participate and win prizes!</h2>
            </header>
            <section>
                <button onClick={loginMetamask}>Connect Wallet</button>
            </section>
            <section>
                <h3>Welcome:{account}</h3>
                <p>Number of attemps left: {attempsLeft >= 0? attempsLeft: 0}</p>
            </section>
            <div className={styles.slotMachineGlobal}>
                <div className={styles.slotMachine}>
                    <section className={styles.slots}>
                        <div><img src={tableOne[(slotOne)%10]}/></div>
                        <div><img src={tableTwo[(slotTwo)%10]}/></div>
                        <div><img src={tableThree[(slotThree)%10]}/></div>
                    </section>
                    <section className={`${styles.slots} ${styles.slotCentral}`}>
                        <div><img src={tableOne[(slotOne+1)%10]}/></div>
                        <div><img src={tableTwo[(slotTwo+1)%10]}/></div>
                        <div><img src={tableThree[(slotThree+1)%10]}/></div>
                    </section>
                    <section className={styles.slots}>
                        <div><img src={tableOne[(slotOne+2)%10]}/></div>
                        <div><img src={tableTwo[(slotTwo+2)%10]}/></div>
                        <div><img src={tableThree[(slotThree+2)%10]}/></div>
                    </section>
                </div>
                <div className={styles.slotMachineBoard}>
                    <img onClick={pullTheLever} src="./../images/cryptocurrencies/pushbutton.svg"/>

                    <div>
                        {tokensEarned}
                    </div>
                    <div>
                        1000 HBT
                    </div>
                </div>
            </div>
            <button onClick={addAddressToWhitelist}>Join Whitelist!</button>
            
        </div>

        </>
    )
}