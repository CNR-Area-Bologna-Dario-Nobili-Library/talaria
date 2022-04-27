import React, { useEffect } from 'react';
import {useIntl} from 'react-intl';
import { useState } from "react";


const FileUpload = props => {
    console.log('file upload component', props)
    const {data,customClass,uploadFile}  = props
    const intl = useIntl()
    const [file, setFile] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalFilename, setFilename] = useState(null)

    function onChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        console.log("file name is " + JSON.stringify(e.target.files[0].name))
        
        if (!files.length)
              return;
        setSelectedFile(e.target.files[0])
        setFilename(e.target.files[0].name)
        createFile(files[0]);
    }

    function createFile(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            setFile(reader.result)
          };
        reader.readAsDataURL(file);
    }

return (
    <>
    <div className={customClass}>
        <div>
            <input type="file" name="file" onChange={onChange} />
            <button type="button" onClick={() => uploadFile(data, file, originalFilename)} className="btn btn-info">Upload file</button>
        </div>
    </div> 
    </>
)}

export default FileUpload;