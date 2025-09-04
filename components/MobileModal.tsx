
import React from 'react';
import { EditIcon, DownloadIcon, GenerateIcon, CloseIcon, UpscaleIcon, CopyIcon } from './Icons';

interface MobileModalProps {
    imageUrl: string | null;
    onClose: () => void;
    onDownload: () => void;
    onEdit: () => void;
    onUpscale: () => void;
    onNewImage: () => void;
    onCopy: () => void;
}

export const MobileModal: React.FC<MobileModalProps> = ({ imageUrl, onClose, onDownload, onEdit, onUpscale, onNewImage, onCopy }) => {
    if (!imageUrl) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col p-4 md:hidden">
            <div className="flex-shrink-0 flex justify-end">
                <button onClick={onClose} className="p-2 text-white"><CloseIcon /></button>
            </div>
            <div className="flex-grow flex items-center justify-center min-h-0">
                <img src={imageUrl} alt="Generated Art" className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
            <div className="flex-shrink-0 grid grid-cols-5 gap-2 pt-4">
                <button onClick={onEdit} className="bg-gray-200 text-gray-800 py-3 rounded-lg flex flex-col items-center justify-center text-xs gap-1"><EditIcon /> Editar</button>
                <button onClick={onUpscale} className="bg-gray-200 text-gray-800 py-3 rounded-lg flex flex-col items-center justify-center text-xs gap-1"><UpscaleIcon /> Upscale</button>
                <button onClick={onCopy} className="bg-gray-200 text-gray-800 py-3 rounded-lg flex flex-col items-center justify-center text-xs gap-1"><CopyIcon /> Copiar</button>
                <button onClick={onDownload} className="bg-gray-200 text-gray-800 py-3 rounded-lg flex flex-col items-center justify-center text-xs gap-1"><DownloadIcon /> Salvar</button>
                <button onClick={onNewImage} className="bg-orange-500 text-white py-3 rounded-lg flex flex-col items-center justify-center text-xs gap-1 shadow-lg shadow-orange-500/50"><GenerateIcon /> Nova</button>
            </div>
        </div>
    );
};
