import Head from 'next/head';
import Image from 'next/image';
import ImageSliderApp from './components/imageSlider';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Web3 Innovation</title>
        <meta name="description" content="Powered by Blockchain Technology." />
        <link rel="icon" href="/7.png" />
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;1,300&display=swap");
        </style>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
      <div>
        <Link href="/airdrop"><a>Whitelist Demo</a></Link>
        <Link href="/ico"><a>ICO Demo</a></Link>
        <Link href="/premiumslot9357"><a>Slot Machine Demo</a></Link>
      </div>
    </div>
  )
}
