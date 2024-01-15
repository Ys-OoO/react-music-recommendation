/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
//todo 待封装，是否需要封装
import { useEffect, useRef, useState } from 'react';

export function SliceUploadInput({ baseChunkSize, uploadUrl, vertifyUrl, mergeUrl }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const updateFile = (e) => {
    console.log(e.target.files[0]);
  };

  useEffect(() => {
    const inputFileEle = inputRef.current;
    if (inputFileEle) {
      //
    }
  }, []);

  return (
    <>
      <input type="file" onChange={updateFile} id="sliceUpload" />
    </>
  );
}
