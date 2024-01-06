/* eslint-disable react/prop-types */
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import style from './style.module.less';

const IBackground = forwardRef(function IBackground({ videoSource, name }, ref) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const textRef = useRef();

  const updateTime = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        handlePause: async () => {
          if (videoRef.current) {
            const isPause = videoRef.current.paused;
            if (isPause) {
              videoRef.current.play();
            } else {
              videoRef.current.pause();
            }
            return !isPause;
          }
        },
        progress: () => {
          if (!videoRef.current) {
            return 0;
          }
          return Math.floor((currentTime.toFixed(2) / videoRef.current.duration.toFixed(2)) * 100);
        },
      };
    },
    [currentTime],
  );

  useEffect(() => {
    let bounce_timer;
    if (textRef.current) {
      //清楚定时器
      setTimeout(() => {
        clearInterval(bounce_timer);
        textRef.current.childNodes.forEach((node) => {
          node.classList.remove('fault');
          node.style.transform = '';
          node.style.clipPath = '';
          node.style.setProperty(`--textContent`, '');
          node.innerHTML = '';
        });
      }, 6000);

      bounce_timer = setInterval(() => {
        textRef.current.childNodes.forEach((node) => {
          node.style.transform = `translate(${Math.random() * 60 - 30}%,${
            Math.random() * 60 - 30
          }%)`;
          let x = Math.random() * 150;
          let y = Math.random() * 150;
          let h = Math.random() * 50 + 50;
          let w = Math.random() * 40 + 10;
          node.style.clipPath = `polygon(${x}% ${y}%,${x + w}% ${y}%,${x + w}% ${y + h}%,${x}% ${
            y + h
          }%)`;
        });
      }, 200);
    }

    return () => {
      clearInterval(bounce_timer);
    };
  }, [videoSource]);

  return (
    <>
      {videoSource ? (
        <div className={style.wallpaper}>
          <video
            className={style.wallpaperVideo}
            autoPlay
            ref={videoRef}
            onTimeUpdate={updateTime}
            src={videoSource}
          ></video>
          <div ref={textRef} className={style.textContainer}>
            {[1, 2, 3].map((_, index) => {
              return (
                <p
                  key={index}
                  className={`${style.chipName}  ${style['fault']}`}
                  style={{ '--textContent': `'${name}'` }}
                >
                  {name}
                </p>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={style.wallpaper}>{'Music Recommendation 🎸'}</div>
      )}
    </>
  );
});

export default IBackground;
