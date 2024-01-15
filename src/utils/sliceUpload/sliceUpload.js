import SparkMD5 from 'spark-md5';
import requestInstance from '../request';

/**
 * @param {File} targetFile 目标上传文件
 * @param {number} baseChunkSize 上传分块大小，单位Mb
 * @param {string} uploadUrl 上传文件的后端接口地址
 * @param {string} vertifyUrl 验证文件上传的接口地址
 * @param {*} mergeUrl 请求进行文件合并的接口地址
 * @returns
 */
async function uploadFile(file, baseChunkSize, uploadUrl, vertifyUrl, mergeUrl, progress_cb) {
  const sliceFileWorker = new Worker(new URL('./sliceFileWorker.js', import.meta.url), { type: 'module' });
  sliceFileWorker.postMessage({ targetFile: file, baseChunkSize })
  sliceFileWorker.onmessage = async (e) => {
    const { chunkList, fileHash } = e.data;
    //所有分片 ArrayBuffer[]
    let allChunkList = chunkList;
    //需要上传的分片序列 number[]
    let neededChunkList = [];
    //上传进度
    let progress = 0;
    //发送请求,获取文件上传状态
    if (vertifyUrl) {
      const { data } = await requestInstance.post(vertifyUrl, {
        fileHash,
        totalCount: allChunkList.length,
        extname: '.' + file.name.split('.').pop(),
      });
      const { neededFileList, message } = data;
      if (message) console.info(message);
      //无待上传文件，秒传
      if (!neededFileList.length) return;

      //部分上传成功，更新unUploadChunkList
      neededChunkList = neededFileList;
    }

    //同步上传进度，断点续传情况下
    progress = ((allChunkList.length - neededChunkList.length) / allChunkList.length) * 100;

    //上传
    if (allChunkList.length) {
      const requestList = allChunkList.map(async (chunk, index) => {
        if (neededChunkList.includes(index + 1)) {
          const response = await uploadChunk(chunk, index + 1, fileHash, uploadUrl);

          //更新进度
          progress += Math.ceil(100 / allChunkList.length);
          if (progress >= 100) progress = 100;
          progress_cb(progress);
          return response;
        }
      });
      Promise.all(requestList).then(() => {
        //发送请求，通知后端进行合并
        requestInstance.post(mergeUrl, { fileHash, extname: '.mp4' });
      });
    }
  }
}

async function uploadChunk(chunk, index, fileHash, uploadUrl) {
  let formData = new FormData();
  //注意这里chunk在之前切片之后未ArrayBuffer，而formData接收的数据类型为 blob|string
  formData.append('chunk', new Blob([chunk]));
  formData.append('index', index);
  formData.append('fileHash', fileHash);
  return requestInstance.post(uploadUrl, formData);
}

/**
 * 将目标文件分片 并 计算文件Hash
 * @param {File} targetFile 目标上传文件
 * @param {number} baseChunkSize 上传分块大小，单位Mb
 * @returns {chunkList:ArrayBuffer,fileHash:string}
 */
// eslint-disable-next-line no-unused-vars
async function sliceFile(targetFile, baseChunkSize = 1) {
  return new Promise((resolve, reject) => {
    //初始化分片方法，兼容问题
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
    //分片大小 baseChunkSize Mb
    let chunkSize = baseChunkSize * 1024 * 1024;
    //目标分片数
    let targetChunkCount = targetFile && Math.ceil(targetFile.size / chunkSize);
    //当前已执行分块数
    let currentChunkCount = 0;
    //创建sparkMD5对象
    let spark = new SparkMD5.ArrayBuffer();
    //创建文件读取对象
    let fileReader = new FileReader();
    let chunkList = [];
    let fileHash = null;

    //FilerReader onload事件
    fileReader.onload = (e) => {
      //当前读取的分块结果 ArrayBuffer
      const curChunk = e.target.result;
      //将当前分块追加到spark对象中
      spark.append(curChunk);
      currentChunkCount++;
      chunkList.push(curChunk);
      //判断分块是否全部读取成功
      if (currentChunkCount >= targetChunkCount) {
        //全部读取，获取文件hash
        fileHash = spark.end();
        resolve({ chunkList, fileHash });
      } else {
        loadNext();
      }
    };

    //FilerReader onerror事件
    fileReader.onerror = () => {
      reject(null);
    };

    //读取下一个分块
    const loadNext = () => {
      //计算分片的起始位置和终止位置
      const start = chunkSize * currentChunkCount;
      let end = start + chunkSize;
      if (end > targetFile.size) {
        end = targetFile.size;
      }
      //读取文件，触发onLoad
      fileReader.readAsArrayBuffer(blobSlice.call(targetFile, start, end));
    };

    loadNext();
  });
}

export { uploadFile };

