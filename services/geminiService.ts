import { GoogleGenAI, Modality } from "@google/genai";
import type { CreateFunction, EditFunction, ImageData, AspectRatio } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPromptForCreateFunction = (prompt: string, negativePrompt: string, func: CreateFunction, textEffectConfig?: { text: string; style: string }): string => {
    let basePrompt: string;
    switch (func) {
        case 'text-effect':
            if (textEffectConfig) {
                const { text, style } = textEffectConfig;
                switch (style) {
                    case 'Neon':
                        basePrompt = `Vibrant neon sign text spelling out '${text}'. The neon should have a bright, electric glow, with subtle light bloom. The scene is set in a dark, moody environment, with dramatic cinematic lighting and a shallow depth of field to make the text pop. Photorealistic, 8k, highly detailed.`;
                        break;
                    case 'Glowing':
                        basePrompt = `Ethereal, magical text '${text}' glowing softly from within. The light should be gentle and diffuse, casting a soft aura. Set against a mystical, dark background with subtle particles in the air. Emphasize cinematic lighting to create drama and a shallow depth of field for focus. Photorealistic, 8k.`;
                        break;
                    case '3D Metallic':
                        basePrompt = `Bold, 3D metallic text '${text}' with a polished chrome or gold finish. Reflections on the metallic surface should be sharp and detailed. Use dramatic cinematic lighting to highlight the metallic sheen and contours, with a clean background and shallow depth of field. Photorealistic, 8k.`;
                        break;
                    case 'Fire':
                        basePrompt = `The text '${text}' forged in roaring flames and embers. The fire should be dynamic, with sparks flying off. The background is a dark, cavernous space, lit only by the fire from the text. Intense cinematic lighting, with heat distortion effects and a shallow depth of field focusing on the fiery letters. Photorealistic, 8k.`;
                        break;
                    case 'Wood':
                        basePrompt = `The text '${text}' intricately carved from rich, dark oak wood. Show detailed wood grain, texture, and imperfections. The text is resting in a rustic, workshop-like setting. Soft, warm cinematic lighting from a single source creates long shadows. A shallow depth of field highlights the craftsmanship of the carving. Photorealistic, 8k.`;
                        break;
                    default:
                         basePrompt = `Cinematic, photorealistic, 8k, detailed image of the text "${text}" with a dramatic ${style} effect. The text should be the main focus of the image. The background should be dark and complementary, with cinematic lighting and depth of field.`;
                }
            } else {
                basePrompt = prompt; // Fallback
            }
            break;
        case 'sticker':
            basePrompt = `A vibrant, die-cut sticker of ${prompt}, vector art, cartoon style, with a thick white border, on a clean white background.`;
            break;
        case 'text':
            basePrompt = `A minimalist and modern text-based logo for "${prompt}". The logo should be clean, professional, and easily readable. Black text on a white background.`;
            break;
        case 'comic':
            basePrompt = `A comic book style panel illustration of ${prompt}, vibrant colors, bold outlines, dynamic action, half-tone dots for shading.`;
            break;
        case 'free':
        default:
            basePrompt = `${prompt}, photorealistic, 8k, detailed, professional photography.`;
            break;
    }

    if (negativePrompt.trim()) {
        return `${basePrompt}. Negative prompt: do not include ${negativePrompt.trim()}.`;
    }
    return basePrompt;
}

export const generateImageFromPrompt = async (
    prompt: string, 
    negativePrompt: string, 
    func: CreateFunction, 
    aspectRatio: AspectRatio,
    textEffectConfig?: { text: string; style: string }
): Promise<string | null> => {
    const finalPrompt = getPromptForCreateFunction(prompt, negativePrompt, func, textEffectConfig);
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: finalPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }

    return null;
};

const getPromptForEditFunction = (prompt: string, func: EditFunction, options?: { blurAmount?: number }): string => {
    switch (func) {
        case 'add-remove':
             return `Please edit the image by following this instruction: ${prompt}. Only change what is requested.`;
        case 'retouch':
            return `Retouch this image to make it look more professional and high-quality, focusing on ${prompt}. Improve lighting and color balance.`;
        case 'style':
            return `Change the style of this image to be ${prompt}. For example: "impressionist painting", "cyberpunk", "vintage black and white photo".`;
        case 'blur':
            const intensity = options?.blurAmount ?? 50;
            if (prompt.trim()) {
                return `Apply a blur effect to the image, focusing on: ${prompt}. The blur intensity should be ${intensity} on a scale of 0 to 100, where 100 is maximum blur.`;
            }
            return `Apply a Gaussian blur effect to the entire image. The blur intensity should be ${intensity} on a scale of 0 to 100, where 100 is maximum blur.`;
        case 'upscale':
            return `Upscale this image to a higher resolution, like 4k. Enhance all details, textures, and the overall quality. Make the image sharper and more defined without changing the original subject or composition.`;
        default:
            return prompt;
    }
}

export const editImage = async (prompt: string, image: ImageData, func: EditFunction, options?: { blurAmount?: number }): Promise<string | null> => {
    const finalPrompt = getPromptForEditFunction(prompt, func, options);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { inlineData: { data: image.data, mimeType: image.mimeType } },
                { text: finalPrompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    return null;
};

export const composeImages = async (prompt: string, image1: ImageData, image2: ImageData): Promise<string | null> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { inlineData: { data: image1.data, mimeType: image1.mimeType } },
                { inlineData: { data: image2.data, mimeType: image2.mimeType } },
                { text: `Combine elements from both images according to this instruction: ${prompt}.` },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    return null;
};
