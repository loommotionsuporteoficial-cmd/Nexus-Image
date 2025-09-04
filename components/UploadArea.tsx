
import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon, CloseIcon } from './Icons';

interface UploadAreaProps {
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    title?: string;
    isDual?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ imageFile, setImageFile, title, isDual = false }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
             const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageFile(null);
        setPreview(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    if (preview && imageFile) {
        return (
            <div className="relative w-full h-full group">
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                <button onClick={clearImage} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CloseIcon />
                </button>
            </div>
        )
    }

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`
                border-2 border-dashed border-gray-300 rounded-lg 
                flex flex-col items-center justify-center text-center
                cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors
                ${isDual ? 'p-3 aspect-square' : 'p-6 h-32'}
            `}
        >
            <UploadIcon />
            <span className={`font-semibold text-gray-600 ${isDual ? 'text-xs' : 'text-sm'}`}>{title || "Clique ou arraste uma imagem"}</span>
            <span className="text-xs text-gray-400">{isDual ? 'Selecionar' : 'PNG, JPG, WebP'}</span>
            <input
                type="file"
                ref={inputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};
