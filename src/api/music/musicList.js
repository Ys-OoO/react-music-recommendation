import requestInstance from "../../utils/request";
export async function getMusicCardList() {
  try {
    const res = await requestInstance.get('/music/all');
    const allMusic = res?.data?.allMusic || [];

    // 使用 Promise.all 并行处理所有请求
    const coverPromises = allMusic.map(async (music) => {
      const blob = await requestInstance.get(`music/view/${music?.mid}`, {
        timeout: 0,
        responseType: 'blob',
        headers: {
          Accept: 'image/png',
        },
      });

      const file = new File([blob], 'xxx', {
        type: 'image/png',
      });

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          resolve(reader.result);
        });
        reader.readAsDataURL(file);
      });
    });

    // 等待所有异步任务完成
    const coverResults = await Promise.all(coverPromises);
    // 将结果赋值给对应的音乐对象
    allMusic.forEach((music, index) => {
      music['cover'] = coverResults[index];
    });

    return allMusic;
  } catch (error) {
    console.error('Error fetching music data:', error);
    throw error;
  }
}

export async function getOne(data) {
  return requestInstance("/music/getOne", { method: "post", data, responseType: 'blob' })
}
export async function downloadMusic(data) {
  return requestInstance("/music//donwloadDirect", {
    method: "post", data, responseType: 'blob', headers: {
      Accept: 'audio/mpeg',
    },
  })
}
export async function uploadMusic(data) {
  const form = new FormData();
  form.append('singer', data.singer);
  form.append('cover', data.cover);
  form.append('name', data.name);
  form.append('music', data.music);

  // return requestInstance("/music/uploadDirect", {
  //   method: "post", form,
  // })
  return requestInstance.post("/music/uploadDirect", form);
}