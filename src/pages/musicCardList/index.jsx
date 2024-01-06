/* eslint-disable react/prop-types */
import { RightOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useEffect, useState } from 'react';
import { getMusicCardList } from '../../api/music/musicList';
import requestInstance from '../../utils/request';
import MusicCard from '../musicCardList/MusicCard';
import PlayCard from './PlayCard';
import style from './style.module.less';
function MusicCardList({ handleVideo, pauseVideo, getProgress }) {
  let [musicList, setMusicList] = useState([]);
  let [curMusic, setCurMusic] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [fadin, setFadeIn] = useState(false);

  const playVideo = async (musicId, music) => {
    if (curMusic && curMusic.mid === musicId) {
      return;
    }
    setCurMusic(music);
    setOpacity(0.7);
    setScale(0.9);
    setFadeIn(true);
    //获取视频
    const blob = await requestInstance.get(`/music/getMusic/${musicId}`, {
      timeout: 0,
      responseType: 'blob',
      headers: {
        Accept: 'video/mp4',
      },
    });
    handleVideo(music, blob);

    setTimeout(() => {
      setFadeIn(false);
    }, 1000);
  };

  function clickCard(musicId) {
    const updateZIndex = musicList.map((music, index) => {
      // 判断当前音乐对象的id是否与传入的musicId匹配
      if (music.mid === musicId) {
        // 如果匹配，更新zIndex属性以及当前播放音乐
        playVideo(musicId, music);
        return { ...music, zIndex: 5 };
      } else {
        return { ...music, zIndex: index };
      }
    });
    setMusicList(updateZIndex);
  }

  function dealData(fetchData) {
    let degUnit = -10,
      translateLeftUnit = 60,
      translateRightUnit = -12;
    let transform = '';
    let preData = fetchData.map((data, index) => {
      if (index === 0) {
        transform = `rotate(${degUnit}deg) translate(-190%, -50%)`;
      } else if (index === fetchData.length - 1) {
        transform = `rotate(12deg) translate(${60}%,-50%)`;
      } else {
        degUnit += 7;
        transform = `rotate(${degUnit}deg) translate(${-190 + translateLeftUnit}%,${
          -50 + translateRightUnit
        }%)`;
        translateLeftUnit += 60;
        translateRightUnit -= 3;
      }
      return {
        ...data,
        transform,
        zIndex: index,
      };
    });

    return preData;
  }

  function nextCard() {
    setOpacity(1);
    setScale(1);
    let musicList_copy = musicList;
    let startTransform = musicList_copy[0].transform;
    let startZIndex = musicList_copy[0].zIndex;
    for (let i = 0; i < musicList_copy.length - 1; i++) {
      musicList_copy[i].transform = musicList_copy[i + 1].transform;
      musicList_copy[i].zIndex = musicList_copy[i + 1].zIndex;
    }
    musicList_copy[musicList_copy.length - 1].transform = startTransform;
    musicList_copy[musicList_copy.length - 1].zIndex = startZIndex;
    setMusicList([...musicList_copy]);
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMusicCardList();
      setMusicList(dealData(data));
    };
    fetchData();
  }, []);

  return (
    <>
      <div className={style.container}>
        <div className={style.otherContainer}>
          <PlayCard
            music={curMusic}
            customStyle={{ opacity: curMusic ? 1 : 0 }}
            fadeIn={fadin}
            pauseVideo={pauseVideo}
            getProgress={getProgress}
          />
        </div>
        <div className={style.listContainer}>
          <div className={style.cardList}>
            {musicList &&
              musicList.map((music) => {
                return (
                  <MusicCard
                    key={music.mid}
                    music={music}
                    clickCard={clickCard}
                    customStyle={{ opacity: opacity, scale: scale }}
                  ></MusicCard>
                );
              })}
          </div>
          <FloatButton
            onClick={nextCard}
            shape="circle"
            style={{
              right: 94,
            }}
            icon={<RightOutlined />}
          />
        </div>
      </div>
    </>
  );
}
export default MusicCardList;
