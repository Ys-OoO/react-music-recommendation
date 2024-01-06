import { Button } from 'antd';
import { downloadMusic } from '../../api/music/musicList';
// eslint-disable-next-line react/prop-types
export function Download({ mid }) {
  const fetchAudio = async () => {
    const stream = await downloadMusic({ mid });
    if (stream) {
      const blob = new Blob([stream], {
        type: 'audio/mpeg',
      });
      // 创建下载链接
      const downloadLink = document.createElement('a');
      // 设置下载链接的属性
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'audio.mp3';

      // 将下载链接添加到文档中
      document.body.appendChild(downloadLink);

      // 模拟用户点击下载链接
      downloadLink.click();
      // 移除下载链接
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div>
      <Button onClick={fetchAudio}>下载</Button>
    </div>
  );
}
