export type Mode = 'create' | 'edit';

export type CreateFunction = 'free' | 'sticker' | 'text' | 'comic' | 'text-effect';

export type EditFunction = 'add-remove' | 'retouch' | 'style' | 'compose' | 'upscale' | 'blur';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface ImageData {
    data: string;
    mimeType: string;
}

export interface ImageHistoryEntry {
    url: string;
    prompt: string;
}
