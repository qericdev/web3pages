import Head from 'next/head'
import Link from 'next/link'
import styles from './../../styles/ImageSliderApp.module.css'
import React from 'react'

export default function ImageSliderApp() {

  const [show, setShow] = React.useState([false, false, false, false, false])

  React.useEffect(() => {
 
    if(show[0] === false && show[1] === false && show[2] === false && show[3] === false) {
      setTimeout(() => {
        let tempShow = [...show]; 
        tempShow[0] = !show[0];
        tempShow[1] = !show[1]; 
        setShow(tempShow)
      }, 4000)
    }
  },[show[0]])

  return (
    
    <div className={styles.container}>

      <Head>
        <title>Ha-Bit | App</title>
        <meta name="description" content="Ha-Bit App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className={!show[0] ? styles.show : styles.hidden}>
          <h1 className={styles.h1}>Welcome to Ha-Bit App</h1>
          <img className={styles.loader} src="./../images/app/loading.png"/>
        </div>

        <div className={show[1] ? styles.show : styles.hidden}>
          <h1 className={styles.h1}>Welcome to Ha-Bit App</h1>
          <img className={styles.img} src="./../images/app/firstIntroImage.png"/>
          <p className={styles.p}>We can help you to be a better version of yourself.</p>
          <div className={styles.selectors}>
          <p onClick={() => {let tempShow = [...show]; tempShow[0] = !show[0]; tempShow[1] = !show[1]; setShow(tempShow)}} className={styles.links}>Back</p>
            <div className={styles.littleCircleFull}></div>
            <div className={styles.littleCircleEmpty}></div>
            <div className={styles.littleCircleEmpty}></div>
            <div className={styles.littleCircleEmpty}></div>
            <p onClick={() => {let tempShow = [...show]; tempShow[1] = !show[1]; tempShow[2] = !show[2]; setShow(tempShow)}} className={styles.links}>Next</p>
          </div>
        </div>

        <div className={show[2] ? styles.show : styles.hidden}>
          <h1 className={styles.h1}>Create a New Habit</h1>
          <img className={styles.img} src="./../images/app/secondIntroImage.png"/>
          <p className={styles.p}>Science behind games is applied in this app</p>
          <div className={styles.selectors}>
            <p onClick={() => {let tempShow = [...show]; tempShow[1] = !show[1]; tempShow[2] = !show[2]; setShow(tempShow)}} className={styles.links}>Back</p>
            <div className={styles.littleCircleEmpty}></div>
            <div className={styles.littleCircleFull}></div>
            <div className={styles.littleCircleEmpty}></div>
            <div className={styles.littleCircleEmpty}></div>
            <p onClick={() => {let tempShow = [...show]; tempShow[2] = !show[2]; tempShow[3] = !show[3]; setShow(tempShow)}} className={styles.links}>Next</p>
          </div>
        </div>

        <div className={show[3] ? styles.show : styles.hidden}>
          <h1 className={styles.h1}>Earn Tokens each Day</h1>
          <img className={styles.img} src="./../images/app/thirdIntroImage.png"/>
          <p className={styles.p}>Everyday you fulfill your habit, you get tokens</p>
          <div className={styles.selectors}>
            <p onClick={() => {let tempShow = [...show]; tempShow[2] = !show[2]; tempShow[3] = !show[3]; setShow(tempShow)}} className={styles.links}>Back</p>
            <div className={styles.littleCircleEmpty}></div>
            <div className={styles.littleCircleEmpty}></div>
            <div className={styles.littleCircleFull}></div>
            <div className={styles.littleCircleEmpty}></div>
            <p onClick={() => {let tempShow = [...show]; tempShow[3] = !show[3]; tempShow[4] = !show[4]; setShow(tempShow)}} className={styles.links}>Next</p>
          </div>
        </div>

        <div className={show[4] ? styles.show : styles.hidden}>
          <h1 className={styles.h1}>Increase your Rewards with NFTs</h1>
          <img className={styles.img} src="./../images/app/fourthIntroImage.png"/>
          <p className={styles.p}>Collect NFTs to multiply your reward of tokens</p>
          <p onClick={() => {let tempShow = [...show]; tempShow[3] = !show[3]; tempShow[4] = !show[4]; setShow(tempShow)}} className={styles.links}>Back</p>
        </div>
      </div>
    </div>
  )
}
