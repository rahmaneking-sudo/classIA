export async function uploadFile(file, options = {}) {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary n'est pas configuré. Veuillez ajouter VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET dans le fichier .env");
  }

  // Define size limits
  const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20 MB
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5 MB

  let resourceType = 'auto';
  if (file.type.startsWith('video/')) {
    resourceType = 'video';
    if (file.size > MAX_VIDEO_SIZE) {
      throw new Error(`La vidéo dépasse la limite autorisée de 20 Mo.`);
    }
  } else if (file.type.startsWith('image/')) {
    resourceType = 'image';
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error(`L'image dépasse la limite autorisée de 5 Mo.`);
    }
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    
    if (options.onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          options.onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          reject(new Error(errorResponse.error?.message || 'Erreur lors de l\'upload vers Cloudinary'));
        } catch {
          reject(new Error('Erreur inconnue lors de l\'upload vers Cloudinary'));
        }
      }
    };
    
    xhr.onerror = () => reject(new Error('Erreur réseau lors de l\'upload'));
    xhr.send(formData);
  });
}
