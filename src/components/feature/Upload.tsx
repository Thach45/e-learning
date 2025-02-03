'use client';

import { useState } from 'react';

export default function Upload() {
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
    }
  };

  const handleUpload = async () => {
    if (!image) return alert('Vui lòng chọn ảnh');

    const response = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: image }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(`Upload thành công: ${data.url}`);
      console.log('Public ID:', data.public_id)
    } else {
      alert(`Lỗi: ${data.error}`);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" width={200} />}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
