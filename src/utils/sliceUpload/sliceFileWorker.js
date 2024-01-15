import SparkMD5 from 'spark-md5';

self.onmessage = async (e) => {
  const { targetFile, baseChunkSize } = e.data;
  const { chunkList, fileHash } = await sliceFile(targetFile, baseChunkSize);
  self.postMessage({ chunkList, fileHash });
}

/**
 * 将目标文件分片 并 计算文件Hash
 * @param {File} targetFile 目标上传文件
 * @param {number} baseChunkSize 上传分块大小，单位Mb
 * @returns {chunkList:ArrayBuffer,fileHash:string}
 */
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
