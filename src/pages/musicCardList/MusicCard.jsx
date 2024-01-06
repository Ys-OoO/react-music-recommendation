/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';
import style from './style.module.less';
// eslint-disable-next-line react/prop-types
export default function MusicCard({ music, clickCard, customStyle }) {
  const cardRef = useRef(null);
  const [move, setMove] = useState(false);

  async function clickMusicCard() {
    clickCard(music.mid, 2);
    setMove(true);

    setTimeout(() => {
      setMove(false);
    }, 1000);
  }

  return (
    <>
      <div
        className={style.poker}
        style={{
          transform: `${music.transform} scale(${customStyle.scale || 1})`,
          zIndex: music.zIndex,
          cursor: 'pointer',
          transition: 'transform 0.3s ease,opacity 0.5s ease',
          opacity: customStyle?.opacity,
        }}
        onClick={() => {
          clickMusicCard();
        }}
      >
        <img src={music.cover}></img>
      </div>
      <div
        ref={cardRef}
        className={`${style.pokerclone} ${move ? style['move-animation'] : null} `}
      >
        <img src={music.cover}></img>
      </div>
    </>
  );
}
