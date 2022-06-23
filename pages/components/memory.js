import Head from 'next/head'
import Link from 'next/link'
import styles from './../../styles/Memory.module.css'
import {useEffect, useState, useRef} from 'react'
import React from 'react'

export default function Memory(props) {

  const [boardContent, setBoardContent] = useState([]);
  const [selections, setSelections] = useState([]);
  const [boardLocked, setBoardLocked] = useState(false);
  const matches = useRef(0);
  const [reload,setReload] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [firstOverlay, setFirstOverLay] = useState(false);

  const tileOptions = ['erupt', 'ptero', 'tri', 'ahahah', 'egg', 'dino'];

  useEffect(() => {
    
    function selectTile(selectedTile) {
      
      if(boardLocked || selectedTile.currentTarget.classList.contains('flipped')) return;
      setBoardLocked(true);
      
      if(selections.length <= 1) {
        selectedTile.currentTarget.classList.add(styles['flipped']);
        let tempSelections = selections;
        tempSelections.push({id: selectedTile.currentTarget.getAttribute('data-id'), tile: selectedTile.currentTarget.getAttribute('tile'), el:selectedTile.currentTarget});
        setSelections(tempSelections);
      }
      
      if(selections.length === 2) {
        
        if(selections[0].tile === selections[1].tile ) {
          
          setTimeout(() => {
            if(selections[0] !==undefined && selections[1]!==undefined) {
            selections[0].el.classList.add(styles['matched']);
            selections[1].el.classList.add(styles['matched']);
            setBoardLocked(false);

            matches.current++;
            
            if(matches.current === tileOptions.length) {
              setTimeout(() => {
                setOverlay(prevOverlay => !prevOverlay);
              },800);
            }

            let tempSelections = selections;
            tempSelections.length = 0;
            setSelections(tempSelections);
          }
          },600)
        } else {
          
          
            setTimeout(() => {
              if(selections[0] !== undefined && selections[1] !== undefined) {
              selections[0].el.classList.remove(styles['flipped']);
              selections[1].el.classList.remove(styles['flipped']);
              setBoardLocked(false);
              let tempSelections = selections;
              tempSelections.length = 0;
              setSelections(tempSelections);
              }
            }, 800);
          
        }

      } else {
        setBoardLocked(false);
      }
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function buildTile(option, id) {
      const tile = <div key={id} data-id={id} tile={option} className={styles.cube} onClick={selectTile}><div className={styles.face}></div><div className={styles.face}></div><div className={`${styles.face} ${styles[option]}`}></div><div className={styles.face}></div><div className={styles.face}></div><div className={styles.face}></div></div>;
      return tile;
    }
    
    function createBoard() {
      
      const tiles = shuffleArray([...tileOptions, ...tileOptions]);
      
      const length = tiles.length;
      let tempBoardContent = [];
      
      for (let i = 0; i < length; i++) {
        setTimeout(() => {
          tempBoardContent.push(buildTile(tiles.pop(),i));
          setBoardContent(tempBoardContent);
          setBoardLocked(false);
        },i*100)
      }
      
    }
    if(!reload) {
      createBoard();
      setReload(true);
    }
  },[reload])

  function doNothing() {

  }

  return (
    
    <div className={styles.container}>

      <Head>
        <title>Contest</title>
        <meta name="description" content="ontest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
        <div className={styles.board}>
          {boardContent}
        </div>
        
   
      <div className={!overlay ? `${styles.overlay} ${styles.hidden}`: styles.overlay}>
        <div className={styles.gameover}>
          <p>You Won 100 Tokens!</p>
          
          <button className={styles.reset}>
              <img onClick={!props.joinedWhitelist && props.walletConnected ? props.addAddressToWhitelist:doNothing} src="./../../images/Join.svg"/>
          </button>
        </div>
        <div className={styles.overlayIco}>
          <Link href="./../ico"><a><button className={styles.overlayIcoReset}>Access to ICO Event Unlocked</button></a></Link>
        </div>
      </div>

      <div className={props.walletConnected ? `${styles.overlay} ${styles.hidden}`: styles.overlay}>
        <div className={styles.gameover} >
          <p>Connect your Wallet</p>
          <button className={styles.reset} >
            <img onClick={props.connectWallet} src="./../../images/Connect.svg"/>
          </button>
        </div>
      </div>

      <audio preload="auto" className={`${styles.audio} ${styles.audioWin}`}>
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/dino-win.mp3"/>
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/dino-win.ogg"/>
      </audio>
      <audio preload="auto" className={`${styles.audio} ${styles.audioAhahah}`}>
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/audio-ahahah.mp3"/>
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/audio-ahahah.ogg"/>
      </audio>
      <audio preload="auto" className={`${styles.audio} ${styles.audioDino}`}>
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/audo-dino.mp3"/>
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/audio-dino.ogg"/>
      </audio>
      <audio preload="auto" className={`${styles.audio} ${styles.audioEgg}`}>
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/audio-egg.mp3"/>
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/audio-egg.ogg"/>
      </audio>
      <audio preload="auto" className={`${styles.audio} ${styles.audioErupt}`} >
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/audio-erupt.mp3"/>
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/audio-erupt.ogg"/>
      </audio>
      <audio preload="auto" className={`${styles.audio} ${styles.audioPtero}`} >
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/audio-ptero.mp3"/>
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/audio-ptero.ogg"/>
      </audio>
      <audio preload="auto" className={`${styles.audio} ${styles.audioTri}`} >
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/audio-tri.mp3"/>
        <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/audio-tri.ogg"/>
      </audio>

    </div>
  )
}
