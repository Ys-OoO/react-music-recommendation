import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import IBackground from '../../components/IBackground';
import { UploadMusic } from '../../components/uploadMusic';
import requestInstance from '../../utils/request';
import LoginModal from '../login';
import MusicCardList from '../musicCardList';
import style from './style.module.less';
function Home() {
  const [open, setOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const videoRef = useRef(null);
  const [isLogin, setIsLogin] = useState(false);
  const [videoSource, setVideSource] = useState(null);
  const [curMusic, setCurMusic] = useState(null);

  const handleVideo = async (curMusic, blob) => {
    setCurMusic(curMusic);
    const url = window.URL.createObjectURL(blob);
    setVideSource(url);
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      return videoRef.current.handlePause();
    }
  };

  const getProgress = () => {
    if (videoRef.current) {
      return videoRef.current.progress();
    }
    return 0;
  };
  //获取当前用户登录状态
  const getCurrentUserStatue = async () => {
    const res = await requestInstance.get('/user/isLogin');
    if (res?.code) {
      setIsLogin(true);
    } else {
      setIsRegister(false);
      setOpen(true);
    }
  };

  useEffect(() => {
    getCurrentUserStatue();
  }, []);

  const openModal = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className={style.header}>
        {isLogin ? null : (
          <>
            <Button
              type="text"
              style={{ color: '#fff' }}
              onClick={() => {
                setIsRegister(false);
                openModal();
              }}
            >
              登录
            </Button>
            <Button
              type="text"
              style={{ color: '#fff' }}
              onClick={() => {
                setIsRegister(true);
                openModal();
              }}
            >
              注册
            </Button>
          </>
        )}
      </div>
      <LoginModal
        isRegister={isRegister}
        open={open}
        onCancel={() => {
          setOpen(false);
          getCurrentUserStatue();
        }}
      />
      <IBackground videoSource={videoSource} ref={videoRef} name={curMusic?.name} />
      <MusicCardList handleVideo={handleVideo} pauseVideo={pauseVideo} getProgress={getProgress} />
      <UploadMusic></UploadMusic>
    </>
  );
}
export default Home;
