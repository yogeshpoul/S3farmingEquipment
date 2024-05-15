import React, { useState } from 'react';
import axios from 'axios';

const S3Uploader = ({onSuccess}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [equipmentName, setEquipmentName] = useState('');
    const [pricing,setPricing]=useState('');

    const handleNameChange = (event) => {
        setEquipmentName(event.target.value);
    };
    const handlePricingChange=(event)=>{
        setPricing(event.target.value)
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    const uploadFile = async () => {
        try {
            console.log(selectedFile.type)
            //   const signedUrl ="https://nodejsprivate.s3.ap-south-1.amazonaws.com/uploads/ysp.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA3C55BWPG66TB6JVH%2F20240515%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240515T090720Z&X-Amz-Expires=900&X-Amz-Signature=a57c34288f4f7c1430a95969c80da7ca5930b98411884791d66c6e2ec033a8a3&X-Amz-SignedHeaders=host&x-id=PutObject";
            const signedUrl = await axios.post("http://localhost:3000/upload-photo", {
                type: selectedFile.type,
                equipmentName
            });
            console.log(signedUrl)


            const options = {
                method: 'PUT',
                body: selectedFile
            };
            await fetch(signedUrl.data.url, options);

            await axios.post("http://localhost:3000/equipment", {
                equipmentName,
                pricing,
                photoKey: signedUrl.data.photoKey
            })
            alert('File uploaded successfully!');
            onSuccess();
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        }
    };

    return (
        <div>
            <div>
                <label>Name:</label>
                <input type="text" value={equipmentName} onChange={handleNameChange} required placeholder='Name of equipment'/>
            </div>
            <div>
                <label>pricing:</label>
                <input type="text" value={pricing} onChange={handlePricingChange} required placeholder='Pricing'/>
            </div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile}>Upload</button>
        </div>
    );
};

export default S3Uploader;
