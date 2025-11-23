
// This service handles uploading images to a public cloud host (Imgur)
// This ensures that images are accessible via a URL, not just local Base64 strings.

// NOTE: This is a public demo Client ID for Imgur. 
// For production, register your own app at https://api.imgur.com/oauth2/addclient to get a Client ID.
const IMGUR_CLIENT_ID = 'e275f1d94f274d7'; 

export const uploadImageToCloud = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();
    if (data.success) {
      return data.data.link; // Returns the public cloud URL (e.g., https://i.imgur.com/xyz.jpg)
    } else {
      throw new Error(data.data.error || 'Upload error');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
