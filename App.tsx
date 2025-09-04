
import React, { useState, useCallback, useEffect } from 'react';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { MobileModal } from './components/MobileModal';
import { ImageHistoryPanel } from './components/ImageHistoryPanel';
import { generateImageFromPrompt, editImage, composeImages } from './services/geminiService';
import type { Mode, CreateFunction, EditFunction, AspectRatio, ImageData, ImageHistoryEntry } from './types';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [negativePrompt, setNegativePrompt] = useState<string>('');
    const [mode, setMode] = useState<Mode>('create');
    const [activeCreateFunc, setActiveCreateFunc] = useState<CreateFunction>('free');
    const [activeEditFunc, setActiveEditFunc] = useState<EditFunction>('add-remove');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [blurAmount, setBlurAmount] = useState<number>(50);
    const [textEffectText, setTextEffectText] = useState<string>('');
    const [textEffectStyle, setTextEffectStyle] = useState<string>('Neon');
    const [promptHistory, setPromptHistory] = useState<string[]>(() => {
        try {
            const storedHistory = localStorage.getItem('promptHistory');
            return storedHistory ? JSON.parse(storedHistory) : [];
        } catch (error) {
            console.error("Failed to load prompt history from local storage", error);
            return [];
        }
    });

    const [imageHistory, setImageHistory] = useState<ImageHistoryEntry[]>(() => {
        try {
            const storedHistory = localStorage.getItem('imageHistory');
            return storedHistory ? JSON.parse(storedHistory) : [];
        } catch (error) {
            console.error("Failed to load image history from local storage", error);
            return [];
        }
    });
    
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);

    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [generatedImagePrompt, setGeneratedImagePrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState<boolean>(false);

    useEffect(() => {
        try {
            localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
        } catch (error) {
            console.error("Failed to save prompt history to local storage", error);
        }
    }, [promptHistory]);

    useEffect(() => {
        try {
            // Limit history size to prevent localStorage overflow
            const limitedHistory = imageHistory.slice(0, 50);
            localStorage.setItem('imageHistory', JSON.stringify(limitedHistory));
        } catch (error) {
            console.error("Failed to save image history to local storage", error);
        }
    }, [imageHistory]);


    const updatePromptHistory = useCallback((newPrompt: string) => {
        if (!newPrompt.trim()) return;
    
        setPromptHistory(prevHistory => {
            const filteredHistory = prevHistory.filter(p => p !== newPrompt);
            const updatedHistory = [newPrompt, ...filteredHistory];
            return updatedHistory.slice(0, 20); // Keep the last 20 unique prompts
        });
    }, []);

    const updateImageHistory = useCallback((url: string, promptForHistory: string) => {
        const newEntry: ImageHistoryEntry = { url, prompt: promptForHistory };
        setImageHistory(prev => {
            const filteredHistory = prev.filter(item => item.url !== url);
            return [newEntry, ...filteredHistory];
        });
    }, []);

    const handleGenerate = useCallback(async () => {
        if (mode === 'create' && activeCreateFunc !== 'text-effect' && !prompt.trim()) {
            setError('Por favor, descreva a imagem que você deseja criar.');
            return;
        }
        if (mode === 'create' && activeCreateFunc === 'text-effect' && !textEffectText.trim()) {
            setError('Por favor, insira o texto para o efeito.');
            return;
        }
        if (mode === 'edit' && activeEditFunc !== 'blur' && !prompt.trim()) {
            setError('Por favor, descreva a edição que você deseja fazer.');
            return;
        }

        if (mode === 'create' && activeCreateFunc === 'text-effect') {
            updatePromptHistory(textEffectText);
        } else {
            updatePromptHistory(prompt);
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImageUrl(null);

        try {
            let resultUrl: string | null = null;
            let promptForHistory: string = '';

            if (mode === 'create') {
                promptForHistory = activeCreateFunc === 'text-effect' ? textEffectText : prompt;
                const textEffectConfig = activeCreateFunc === 'text-effect' ? { text: textEffectText, style: textEffectStyle } : undefined;
                resultUrl = await generateImageFromPrompt(prompt, negativePrompt, activeCreateFunc, aspectRatio, textEffectConfig);
            } else { // edit mode
                promptForHistory = prompt;
                if (activeEditFunc === 'compose') {
                    if (!image1 || !image2) {
                        setError('Por favor, envie duas imagens para unir.');
                        setIsLoading(false);
                        return;
                    }
                    const [base64Image1, base64Image2] = await Promise.all([
                        fileToBase64(image1),
                        fileToBase64(image2),
                    ]);
                    resultUrl = await composeImages(prompt, { data: base64Image1, mimeType: image1.type }, { data: base64Image2, mimeType: image2.type });
                } else {
                    if (!image1) {
                        setError('Por favor, envie uma imagem para editar.');
                        setIsLoading(false);
                        return;
                    }
                    const base64Image1 = await fileToBase64(image1);
                    const editOptions = {
                        blurAmount: activeEditFunc === 'blur' ? blurAmount : undefined
                    };
                    resultUrl = await editImage(prompt, { data: base64Image1, mimeType: image1.type }, activeEditFunc, editOptions);
                }
            }

            if(resultUrl) {
                setGeneratedImageUrl(resultUrl);
                setGeneratedImagePrompt(promptForHistory);
                updateImageHistory(resultUrl, promptForHistory);
                if (window.innerWidth < 768) {
                    setIsModalOpen(true);
                }
            } else {
                setError('Não foi possível gerar a imagem. Tente novamente.');
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt, negativePrompt, mode, activeCreateFunc, activeEditFunc, image1, image2, aspectRatio, updatePromptHistory, textEffectText, textEffectStyle, updateImageHistory, blurAmount]);
    
    const handleDownload = () => {
        if (!generatedImageUrl) return;
        const link = document.createElement('a');
        link.href = generatedImageUrl;
        link.download = `${generatedImagePrompt.substring(0, 20).replace(/\s/g, '_') || 'ai-image'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopy = useCallback(async () => {
        if (!generatedImageUrl) {
            setError('Nenhuma imagem para copiar.');
            return;
        }
        
        try {
            const response = await fetch(generatedImageUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob,
                }),
            ]);
            alert('Imagem copiada para a área de transferência!');
        } catch (err) {
            console.error('Falha ao copiar a imagem: ', err);
            setError('Não foi possível copiar a imagem. Seu navegador pode não suportar esta ação ou a permissão foi negada.');
        }
    }, [generatedImageUrl]);

    const handleEditCurrentImage = () => {
        setMode('edit');
        setActiveEditFunc('add-remove');
        setImage1(null); 
        setImage2(null);
        setPrompt('');
        alert('Modo de edição ativado. Por favor, arraste a imagem gerada para a área de upload para começar a editar.');
    };

    const handleUpscale = useCallback(async () => {
        if (!generatedImageUrl) {
            setError('Nenhuma imagem para ampliar.');
            return;
        }
    
        setIsLoading(true);
        setError(null);
        if (isModalOpen) setIsModalOpen(false);
    
        try {
            const match = generatedImageUrl.match(/^data:(image\/.*?);base64,(.*)$/);
            if (!match) {
                throw new Error('Formato de URL de imagem inválido.');
            }
            const [, mimeType, base64Data] = match;
    
            const imageData: ImageData = {
                data: base64Data,
                mimeType: mimeType,
            };
    
            const resultUrl = await editImage('', imageData, 'upscale');
    
            if(resultUrl) {
                setGeneratedImageUrl(resultUrl);
                updateImageHistory(resultUrl, generatedImagePrompt); // Use existing prompt
                 if (window.innerWidth < 768) {
                    setIsModalOpen(true);
                }
            } else {
                setError('Não foi possível ampliar a imagem. Tente novamente.');
            }
    
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Ocorreu um erro desconhecido durante o upscale.');
        } finally {
            setIsLoading(false);
        }
    }, [generatedImageUrl, isModalOpen, generatedImagePrompt, updateImageHistory]);

    const handleSelectFromHistory = (entry: ImageHistoryEntry) => {
        setGeneratedImageUrl(entry.url);
        setGeneratedImagePrompt(entry.prompt);
        setIsHistoryPanelOpen(false);
    };

    const handleClearImageHistory = () => {
        setImageHistory([]);
    };
    
    const resetToNewImage = () => {
        setMode('create');
        setPrompt('');
        setNegativePrompt('');
        setImage1(null);
        setImage2(null);
        setGeneratedImageUrl(null);
        setGeneratedImagePrompt('');
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen md:h-screen font-sans bg-white text-gray-800">
            <ImageHistoryPanel
                isOpen={isHistoryPanelOpen}
                history={imageHistory}
                onClose={() => setIsHistoryPanelOpen(false)}
                onSelect={handleSelectFromHistory}
                onClear={handleClearImageHistory}
            />
            <LeftPanel
                prompt={prompt}
                setPrompt={setPrompt}
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
                mode={mode}
                setMode={setMode}
                activeCreateFunc={activeCreateFunc}
                setActiveCreateFunc={setActiveCreateFunc}
                activeEditFunc={activeEditFunc}
                setActiveEditFunc={setActiveEditFunc}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                promptHistory={promptHistory}
                image1={image1}
                setImage1={setImage1}
                image2={image2}
                setImage2={setImage2}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                error={error}
                textEffectText={textEffectText}
                setTextEffectText={setTextEffectText}
                textEffectStyle={textEffectStyle}
                setTextEffectStyle={setTextEffectStyle}
                blurAmount={blurAmount}
                setBlurAmount={setBlurAmount}
                onToggleHistoryPanel={() => setIsHistoryPanelOpen(true)}
            />
            <RightPanel
                isLoading={isLoading}
                generatedImageUrl={generatedImageUrl}
                onDownload={handleDownload}
                onEdit={handleEditCurrentImage}
                onUpscale={handleUpscale}
                onOpenModal={() => setIsModalOpen(true)}
                onCopy={handleCopy}
            />
            {isModalOpen && (
                 <MobileModal
                    imageUrl={generatedImageUrl}
                    onClose={() => setIsModalOpen(false)}
                    onDownload={handleDownload}
                    onEdit={handleEditCurrentImage}
                    onUpscale={handleUpscale}
                    onNewImage={resetToNewImage}
                    onCopy={handleCopy}
                />
            )}
        </div>
    );
};

export default App;
