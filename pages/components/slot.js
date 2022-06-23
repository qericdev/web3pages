import Head from "next/head";
import styles from "./../../styles/Whitelist.module.css";
import { useEffect, useRef, useState } from "react";

export default function slot() {

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

    return (
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
                        Left: {attempsLeft}
                    </div>
                </div>
            </div>
      );
    }