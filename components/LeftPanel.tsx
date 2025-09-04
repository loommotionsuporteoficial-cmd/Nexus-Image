
import React from 'react';
import type { Mode, CreateFunction, EditFunction, AspectRatio } from '../types';
import { FunctionCard } from './FunctionCard';
import { UploadArea } from './UploadArea';
import { AIFillIcon, AddRemoveIcon, ComposeIcon, GenerateIcon, HQIcon, LogoIcon, RetouchIcon, StickerIcon, StyleIcon, BackIcon, AspectRatio1x1Icon, AspectRatio16x9Icon, AspectRatio9x16Icon, AspectRatio4x3Icon, AspectRatio3x4Icon, HistoryIcon, NegativePromptIcon, TextEffectIcon, ImageHistoryIcon, BlurIcon } from './Icons';

interface LeftPanelProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    negativePrompt: string;
    setNegativePrompt: (prompt: string) => void;
    mode: Mode;
    setMode: (mode: Mode) => void;
    activeCreateFunc: CreateFunction;
    setActiveCreateFunc: (func: CreateFunction) => void;
    activeEditFunc: EditFunction;
    setActiveEditFunc: (func: EditFunction) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (ratio: AspectRatio) => void;
    promptHistory: string[];
    image1: File | null;
    setImage1: (file: File | null) => void;
    image2: File | null;
    setImage2: (file: File | null) => void;
    onGenerate: () => void;
    isLoading: boolean;
    error: string | null;
    textEffectText: string;
    setTextEffectText: (text: string) => void;
    textEffectStyle: string;
    setTextEffectStyle: (style: string) => void;
    blurAmount: number;
    setBlurAmount: (amount: number) => void;
    onToggleHistoryPanel: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
    prompt, setPrompt, negativePrompt, setNegativePrompt, mode, setMode, activeCreateFunc, setActiveCreateFunc,
    activeEditFunc, setActiveEditFunc, aspectRatio, setAspectRatio, promptHistory, image1, setImage1, image2, setImage2,
    onGenerate, isLoading, error, textEffectText, setTextEffectText, textEffectStyle, setTextEffectStyle,
    blurAmount, setBlurAmount, onToggleHistoryPanel
}) => {

    const showTwoImagesSection = mode === 'edit' && activeEditFunc === 'compose';
    const showEditFunctions = mode === 'edit' && !showTwoImagesSection;
    const showTextEffectControls = mode === 'create' && activeCreateFunc === 'text-effect';

    const handleModeChange = (newMode: Mode) => {
        setMode(newMode);
        // Reset images when switching modes
        setImage1(null);
        setImage2(null);
    }
    
    const backToEditFunctions = () => {
        setActiveEditFunc('add-remove'); // or reset to a default
    };

    const aspectRatios: { value: AspectRatio; icon: React.ReactNode; label: string }[] = [
        { value: '1:1', icon: <AspectRatio1x1Icon />, label: '1:1' },
        { value: '16:9', icon: <AspectRatio16x9Icon />, label: '16:9' },
        { value: '9:16', icon: <AspectRatio9x16Icon />, label: '9:16' },
        { value: '4:3', icon: <AspectRatio4x3Icon />, label: '4:3' },
        { value: '3:4', icon: <AspectRatio3x4Icon />, label: '3:4' },
    ];
    
    const textEffectStyles = [
        { key: 'Neon', label: 'Neon' },
        { key: 'Glowing', label: 'Brilhante' },
        { key: '3D Metallic', label: 'Metálico 3D' },
        { key: 'Fire', label: 'Fogo' },
        { key: 'Wood', label: 'Madeira' },
    ];

    return (
        <div className="w-full md:w-1/3 xl:w-1/4 h-full bg-white p-4 md:p-6 flex flex-col gap-4 overflow-y-auto border-r border-gray-200">
            <header>
                 <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-[length:200%_auto] animate-text-shimmer">
                        Nexus Image
                    </h1>
                    <button
                        onClick={onToggleHistoryPanel}
                        title="Ver histórico de imagens"
                        className="text-gray-500 hover:text-orange-500 transition-colors"
                        aria-label="Ver histórico de imagens"
                    >
                        <ImageHistoryIcon />
                    </button>
                </div>
                <p className="text-sm text-gray-500">Gerador profissional de imagens</p>
            </header>

            {mode === 'create' && !showTextEffectControls && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">💭 Descreva sua ideia</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 rounded-lg p-3 h-20 md:h-24 resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Descreva a imagem que você deseja criar ou a edição a ser feita..."
                    />
                </div>
            )}

            {mode === 'edit' && (
                 <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">💭 Descreva sua ideia</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 rounded-lg p-3 h-20 md:h-24 resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Descreva a edição a ser feita..."
                    />
                </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 bg-gray-200 p-1 rounded-lg">
                <button 
                    onClick={() => handleModeChange('create')}
                    className={`py-2 px-4 text-sm font-semibold rounded-md transition-colors ${mode === 'create' ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                >
                    Criar
                </button>
                 <button 
                    onClick={() => handleModeChange('edit')}
                    className={`py-2 px-4 text-sm font-semibold rounded-md transition-colors ${mode === 'edit' ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                >
                    Editar
                </button>
            </div>
            
            {mode === 'create' && (
                <>
                    {showTextEffectControls ? (
                        <>
                             <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">✨ Digite o Texto</label>
                                <input
                                    type="text"
                                    value={textEffectText}
                                    onChange={(e) => setTextEffectText(e.target.value)}
                                    className="bg-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    placeholder="Seu texto aqui..."
                                    aria-label="Texto para efeito visual"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">🎨 Estilo</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {textEffectStyles.map((style) => (
                                        <button
                                            key={style.key}
                                            onClick={() => setTextEffectStyle(style.key)}
                                            className={`py-2 px-1 text-sm font-semibold rounded-md transition-colors ${textEffectStyle === style.key ? 'bg-orange-500 text-white' : 'text-gray-600 bg-gray-200 hover:bg-gray-300'}`}
                                        >
                                            {style.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><NegativePromptIcon /> Prompt Negativo (Opcional)</label>
                            <textarea
                                value={negativePrompt}
                                onChange={(e) => setNegativePrompt(e.target.value)}
                                className="bg-white border border-gray-300 text-gray-900 rounded-lg p-3 h-16 md:h-20 resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                placeholder="Ex: texto, pessoas, cores feias..."
                            />
                        </div>
                    )}


                    <div className="grid grid-cols-3 gap-2">
                        <FunctionCard name="Prompt" icon={<AIFillIcon />} active={activeCreateFunc === 'free'} onClick={() => setActiveCreateFunc('free')} />
                        <FunctionCard name="Adesivos" icon={<StickerIcon />} active={activeCreateFunc === 'sticker'} onClick={() => setActiveCreateFunc('sticker')} />
                        <FunctionCard name="Logo" icon={<LogoIcon />} active={activeCreateFunc === 'text'} onClick={() => setActiveCreateFunc('text')} />
                        <FunctionCard name="HQ" icon={<HQIcon />} active={activeCreateFunc === 'comic'} onClick={() => setActiveCreateFunc('comic')} />
                        <FunctionCard name="Efeito Texto" icon={<TextEffectIcon />} active={activeCreateFunc === 'text-effect'} onClick={() => setActiveCreateFunc('text-effect')} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">🖼️ Proporção</label>
                        <div className="grid grid-cols-5 gap-1 bg-gray-200 p-1 rounded-lg">
                           {aspectRatios.map((ratio) => (
                                <button
                                    key={ratio.value}
                                    onClick={() => setAspectRatio(ratio.value)}
                                    title={ratio.label}
                                    className={`
                                        py-2 px-1 text-sm font-semibold rounded-md transition-colors flex flex-col items-center justify-center gap-1
                                        ${aspectRatio === ratio.value ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}
                                    `}
                                >
                                    {ratio.icon}
                                    <span className="text-xs">{ratio.label}</span>
                                </button>
                           ))}
                        </div>
                    </div>
                </>
            )}

            {showEditFunctions && (
                 <>
                    <div className="grid grid-cols-3 gap-3">
                        <FunctionCard name="Adicionar" icon={<AddRemoveIcon />} active={activeEditFunc === 'add-remove'} onClick={() => setActiveEditFunc('add-remove')} />
                        <FunctionCard name="Retoque" icon={<RetouchIcon />} active={activeEditFunc === 'retouch'} onClick={() => setActiveEditFunc('retouch')} />
                        <FunctionCard name="Estilo" icon={<StyleIcon />} active={activeEditFunc === 'style'} onClick={() => setActiveEditFunc('style')} />
                        <FunctionCard name="Desfoque" icon={<BlurIcon />} active={activeEditFunc === 'blur'} onClick={() => setActiveEditFunc('blur')} />
                        <FunctionCard name="Unir" icon={<ComposeIcon />} active={activeEditFunc === 'compose'} onClick={() => setActiveEditFunc('compose')} />
                    </div>
                    {activeEditFunc === 'blur' && (
                        <div className="flex flex-col gap-2 py-2">
                            <label htmlFor="blur-slider" className="text-sm font-semibold text-gray-700 flex justify-between">
                                <span>Intensidade do Desfoque</span>
                                <span>{blurAmount}</span>
                            </label>
                            <input
                                id="blur-slider"
                                type="range"
                                min="0"
                                max="100"
                                value={blurAmount}
                                onChange={(e) => setBlurAmount(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                aria-label="Intensidade do Desfoque"
                            />
                        </div>
                    )}
                    <UploadArea imageFile={image1} setImageFile={setImage1} />
                </>
            )}

            {showTwoImagesSection && (
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-gray-700 text-center">📸 Duas Imagens Necessárias</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <UploadArea imageFile={image1} setImageFile={setImage1} title="Primeira Imagem" isDual={true} />
                        <UploadArea imageFile={image2} setImageFile={setImage2} title="Segunda Imagem" isDual={true} />
                    </div>
                     <button onClick={backToEditFunctions} className="text-sm text-orange-600 hover:text-orange-500 flex items-center gap-1 justify-center">
                        <BackIcon /> Voltar para Edição
                    </button>
                </div>
            )}
            
            <div className="flex flex-col gap-1 mt-4">
                <label htmlFor="prompt-history" className="text-sm font-semibold text-gray-700 flex items-center gap-2"><HistoryIcon /> Histórico de Prompts</label>
                <div className="relative">
                    <select
                        id="prompt-history"
                        onChange={(e) => {
                            if (e.target.value) {
                                if (activeCreateFunc === 'text-effect') {
                                    setTextEffectText(e.target.value);
                                } else {
                                    setPrompt(e.target.value);
                                }
                                e.target.value = ""; // Reset select to placeholder
                            }
                        }}
                        defaultValue=""
                        className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg py-2 pl-3 pr-8 appearance-none focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                        disabled={promptHistory.length === 0}
                        aria-label="Histórico de Prompts"
                    >
                        <option value="" disabled>{promptHistory.length > 0 ? 'Selecionar um prompt anterior...' : 'Nenhum histórico ainda'}</option>
                        {promptHistory.map((p) => (
                            <option key={p} value={p}>
                                {p.length > 50 ? p.substring(0, 47) + '...' : p}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>


            <div className="mt-auto">
                {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-400/50"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Gerando...</span>
                        </>
                    ) : (
                       <> <GenerateIcon /> Gerar Imagem </>
                    )}
                </button>
            </div>
        </div>
    );
};
