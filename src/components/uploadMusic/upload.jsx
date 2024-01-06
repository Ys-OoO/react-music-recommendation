// eslint-disable-next-line react/prop-types
export default function UploadFile({ onChange, isCover }) {
  // const isControlled = value !== '';
  // const [selectFilePath, setSelectFilePath] = useState(isControlled ? value : {});
  // const finalValue = isControlled ? value : selectFilePath;

  function getFile(e) {
    let file = e.target.files[0];
    // setSelectFilePath(e.target.value);
    if (isCover) {
      onChange?.(file, true);
    } else {
      onChange?.(file, false);
    }
  }
  return (
    <div>
      <input type="file" onChange={getFile}></input>
    </div>
  );
}
