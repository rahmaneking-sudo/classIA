import React, { useState } from 'react';
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '../../services/cloudinaryUpload';
import Swal from 'sweetalert2';

const ImageUpload = ({ onUpload, currentImage, label = "Ajouter une image", className = "" }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);
      const data = await uploadFile(file, {
        onProgress: (p) => setProgress(p)
      });
      onUpload(data.url);
    } catch (error) {
      Swal.fire({
        background: '#0a0a10',
        color: '#ffffff',
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Impossible de télécharger l\'image'
      });
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className={`relative ${className}`}>
      {currentImage ? (
        <div className="relative group rounded-lg overflow-hidden border border-white/10 w-full h-24 bg-[#11111a]">
          <img src={currentImage} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button 
                type="button"
                onClick={() => onUpload('')}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
             >
                <X className="w-4 h-4" />
             </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          />
          <div className={`w-full h-24 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center bg-[#11111a] hover:bg-[#1a1a24] transition-colors ${uploading ? 'opacity-50' : ''}`}>
            {uploading ? (
              <div className="flex flex-col items-center">
                 <Loader2 className="w-6 h-6 text-[var(--color-neon-blue)] animate-spin mb-2" />
                 <span className="text-xs text-gray-400">{progress}%</span>
              </div>
            ) : (
              <>
                <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">{label}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
