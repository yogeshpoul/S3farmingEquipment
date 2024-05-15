// EquipmentRegistrationForm.js

import React, { useState } from 'react';
import axios from 'axios';

const EquipmentRegistrationForm = () => {
    const [name, setName] = useState('');
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleNameChange = (event) => {
        setName(event.target.value);

    };

    const handleImageChange = (event) => {
        const selectedFiles = event.target.files;
        setImages(selectedFiles);
        console.log(event.target.files)
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('files', files);

        try {
            // Send equipment data to backend
            fetch('https://nodejsprivate.s3.ap-south-1.amazonaws.com/uploads/yp.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA3C55BWPG66TB6JVH%2F20240515%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240515T084821Z&X-Amz-Expires=900&X-Amz-Signature=44a62f798e8aa7d59e985fd7a018850e16941ee37b1569d35faccdf551b5241f&X-Amz-SignedHeaders=host&x-id=PutObject', {
                method: 'PUT',
                body: formData
            })
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            // Reset form fields
            setName('');
            setImages([]);
        } catch (error) {
            console.error('Error registering equipment:', error);
        }

        setIsLoading(false);
    };

    return (
        <div>
            <h2>Equipment Registration</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={handleNameChange} required />
                </div>
                <div>
                    <label>Images:</label>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} required />
                </div>
                <button type="submit" disabled={isLoading}>Register</button>
            </form>
        </div>
    );
};

export default EquipmentRegistrationForm;
