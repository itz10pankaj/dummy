import React, { useState } from 'react';
import axios from 'axios';

const ImageReader = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [resizeToFileSize, setResizeToFileSize] = useState(false); 
  const [targetFileSize, setTargetFileSize] = useState(100); 
  const [loading, setLoading] = useState(false);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalImage(file);
      setPreview(URL.createObjectURL(file));
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setWidth(img.width);  
        setHeight(img.height); 
      };
      const sizeInKB = (file.size / 1024).toFixed(2);
      setTargetFileSize(sizeInKB); 
    }
  };

  const handleWidthChange = (e) => {
    var regex2 = /^\d+$/;
    const value = e.target.value;
    if (regex2.test(value)) {  
        setWidth(value);
      }
  };

  const handleHeightChange = (e) => {
    var regex2 = /^\d+$/;
    const value = e.target.value;
    if (regex2.test(value)) {  
        setHeight(value);
      }
  };

  const handleTargetFileSizeChange = (e) => {
    var regex2 = /^\d+$/;
    const value = e.target.value;
    if (regex2.test(value)) {  
        setTargetFileSize(value);
      }
  };

  const handleResizeOptionChange = () => {
    setResizeToFileSize(!resizeToFileSize);
  };

  const handleSubmit = async () => {
    if (!originalImage) return alert('Please upload an image');

    const formData = new FormData();
    formData.append('image', originalImage);

    if (resizeToFileSize) {
      formData.append('resizeToFileSize', targetFileSize); 
    } else {
      formData.append('widthSize', width);
      formData.append('heightSize', height);
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8081/api/image-handle', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data);
      alert('Image uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Upload and Resize Image</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {preview && (
        <div className="w-48 h-48 overflow-hidden border">
          <img src={preview} alt="Preview" className="object-contain w-full h-full" />
        </div>
      )}

      <div>
        <label className="block mb-2">Resize to Target File Size (KB):</label>
        <input
          type="checkbox"
          checked={resizeToFileSize}
          onChange={handleResizeOptionChange}
        />
        <label className="ml-2">Enable to resize based on target file size</label>

        {resizeToFileSize ? (
          <div>
            <label className="block mb-2">Target File Size (KB):</label>
            <input
              type="number"
              value={targetFileSize}
              onChange={handleTargetFileSizeChange}
              className="border p-2 w-full"
              min="1"
            />
          </div>
        ) : (
          <>
            <div>
              <label className="block mb-2">Width Size:</label>
              <input
                type="number"
                value={width}
                onChange={handleWidthChange}
                className="border p-2 w-full"
                min="0"
              />
            </div>
            <div>
              <label className="block mb-2">Height Size:</label>
              <input
                type="number"
                value={height}
                onChange={handleHeightChange}
                className="border p-2 w-full"
                min="0"
              />
            </div>
          </>
        )}
      </div>
      
      {!loading ? <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Upload
      </button>:
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Uploading
      </button>
        }
    </div>
  );
};

export default ImageReader;
