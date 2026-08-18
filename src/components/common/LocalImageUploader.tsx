'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle2, X, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface LocalImageUploaderProps {
  label?: string;
  folder?: string;
  value: string;
  onChange: (url: string) => void;
}

export default function LocalImageUploader({
  label = 'Product Image',
  folder = 'products',
  value,
  onChange,
}: LocalImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.status === 1 && data.data?.url) {
        onChange(data.data.url);
      } else {
        alert(data.message || 'Image upload failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Upload Error:', err);
      alert('Error uploading file to local server.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-300">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#0aad0a] hover:underline flex items-center gap-1 font-semibold"
        >
          <LinkIcon size={12} />
          <span>{showUrlInput ? 'Upload Local File' : 'Use External URL'}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste image URL (https://...)"
            className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#0aad0a]"
          />
          <button
            type="button"
            onClick={handleCustomUrlSubmit}
            className="bg-[#0aad0a] text-white text-xs font-bold px-4 rounded-xl"
          >
            Apply
          </button>
        </div>
      ) : value ? (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 flex items-center justify-center group">
          <Image src={value} alt="Preview" fill className="object-contain p-2" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#0aad0a] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow"
            >
              Replace Image
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-700 hover:border-[#0aad0a] rounded-2xl p-6 text-center cursor-pointer bg-gray-900/40 transition-colors"
        >
          {isUploading ? (
            <div className="space-y-2 flex flex-col items-center">
              <Loader2 size={28} className="animate-spin text-[#0aad0a]" />
              <p className="text-xs font-bold text-gray-300">Saving image locally to server...</p>
            </div>
          ) : (
            <div className="space-y-1">
              <UploadCloud size={28} className="mx-auto text-gray-400 mb-1" />
              <p className="text-xs font-bold text-gray-300">Click or drag image to upload locally</p>
              <p className="text-[10px] text-gray-500">Auto-saved to public/uploads/{folder} (PNG, JPG, WEBP)</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
