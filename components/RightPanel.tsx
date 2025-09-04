
import React from 'react';
import { EditIcon, DownloadIcon, PlaceholderIcon, ExpandIcon, UpscaleIcon, CopyIcon } from './Icons';

interface RightPanelProps {
    isLoading: boolean;
    generatedImageUrl: string | null;
    onDownload: () => void;
    onEdit: () => void;
    onUpscale: () => void;
    onOpenModal: () => void;
    onCopy: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ isLoading, generatedImageUrl, onDownload, onEdit, onUpscale, onOpenModal, onCopy }) => {
    return (
        <div className="hidden md:flex w-full md:w-2/3 xl:w-3/4 h-full bg-gray-100 p-4 md:p-6 items-center justify-center">
            <div className="w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center relative">
                {isLoading && (
                    <div className="text-center text-gray-500">
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500 mx-auto mb-4"></div>
                        <p className="text-lg font-semibold">Gerando sua imagem...</p>
                        <p className="text-sm">Isso pode levar alguns instantes.</p>
                    </div>
                )}
                {!isLoading && !generatedImageUrl && (
                    <div className="text-center text-gray-400">
                        <PlaceholderIcon />
                        <p className="mt-4 text-xl font-medium">Sua obra de arte aparecerá aqui</p>
                    </div>
                )}
                {!isLoading && generatedImageUrl && (
                    <div className="relative group w-full h-full flex items-center justify-center">
                        <img 
                            src={generatedImageUrl} 
                            alt="Generated Art" 
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-gray-900/10"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                           <div className="flex gap-4">
                               <button onClick={onEdit} title="Editar" className="bg-white/80 backdrop-blur-sm p-4 rounded-full text-gray-800 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg"><EditIcon /></button>
                               <button onClick={onUpscale} title="Upscale" className="bg-white/80 backdrop-blur-sm p-4 rounded-full text-gray-800 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg"><UpscaleIcon /></button>
                               <button onClick={onCopy} title="Copiar Imagem" className="bg-white/80 backdrop-blur-sm p-4 rounded-full text-gray-800 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg"><CopyIcon /></button>
                               <button onClick={onDownload} title="Download" className="bg-white/80 backdrop-blur-sm p-4 rounded-full text-gray-800 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg"><DownloadIcon /></button>
                               <button onClick={onOpenModal} title="Expandir" className="bg-white/80 backdrop-blur-sm p-4 rounded-full text-gray-800 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg"><ExpandIcon /></button>
                           </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
