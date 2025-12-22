 export const UploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blogcloudinary");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxpfnaruw/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url; 
  };