
import React from 'react';
import type { ImageHistoryEntry } from '../types';
import { CloseIcon, DeleteIcon, PlaceholderIcon } from './Icons';

interface ImageHistoryPanelProps {
    isOpen: boolean;
    history: ImageHistoryEntry[];
    onClose: () => void;
    onSelect: (entry: ImageHistoryEntry) => void;
    onClear: () => void;
}

export const ImageHistoryPanel: React.FC<ImageHistoryPanelProps> = ({ isOpen, history, onClose, onSelect, onClear }) => {
    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Panel */}
            <div 
                className={`fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="history-panel-title"
            >
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 id="history-panel-title" className="text-lg font-semibold text-gray-900">Histórico de Imagens</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors" aria-label="Fechar painel de histórico">
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex-grow p-4 overflow-y-auto">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                            <PlaceholderIcon />
                            <p className="mt-4 text-lg font-medium">Seu histórico está vazio</p>
                            <p className="text-sm">As imagens que você gerar aparecerão aqui.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {history.map((entry, index) => (
                                <button 
                                    key={`${entry.url}-${index}`} 
                                    onClick={() => onSelect(entry)} 
                                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white group"
                                    aria-label={`Selecionar imagem com prompt: ${entry.prompt}`}
                                >
                                    <img 
                                        src={entry.url} 
                                        alt={entry.prompt} 
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {history.length > 0 && (
                    <footer className="flex-shrink-0 p-4 border-t border-gray-200">
                        <button 
                            onClick={onClear} 
                            disabled={history.length === 0} 
                            className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                        >
                            <DeleteIcon />
                            <span>Limpar Histórico</span>
                        </button>
                    </footer>
                )}
            </div>
        </>
    );
};
