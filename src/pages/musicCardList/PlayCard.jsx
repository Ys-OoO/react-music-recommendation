/* eslint-disable react/prop-types */
import { PauseCircleTwoTone, PlayCircleTwoTone } from '@ant-design/icons';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import style from './style.module.less';
export default function PlayCard({ music, fadeIn, customStyle, pauseVideo, getProgress }) {
  const [isPause, setIsPause] = useState(false);
  const [progress, setProgress] = useState(0);
  const handlePlay = debounce(async () => {
    const curState = await pauseVideo();
    console.log(curState);
    setIsPause(curState);
  }, 100);

  useEffect(() => {
    const progress_timer = setInterval(() => {
      const curProgress = getProgress();
      setProgress(curProgress);
    }, 1000);

    return () => {
      clearInterval(progress_timer);
    };
  }, []);

  return (
    <div
      className={`${style.playCardContainer}`}
      style={{ opacity: customStyle.opacity }}
      onClick={handlePlay}
    >
      <div className={`${style.contentBox} ${fadeIn ? style['fadeIn-animation'] : null}`}>
        {music?.cover && (
          <img className={isPause ? null : style['rotate-animation']} src={music?.cover}></img>
        )}
        <div className={style.musicInfo}>
          <div className={style.name}>{music?.name}</div>
          <div className={style.singer}>{music?.singer}</div>
        </div>
        <div className={style.footer}>
          {isPause ? (
            <PlayCircleTwoTone
              twoToneColor={'#5174ff'}
              style={{ fontSize: 24 }}
              onClick={handlePlay}
            />
          ) : (
            <PauseCircleTwoTone
              twoToneColor={'#5174ff'}
              style={{ fontSize: 24 }}
              onClick={handlePlay}
            />
          )}
          <div className={style.progressBar}>
            <div className={style.curProgress} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
