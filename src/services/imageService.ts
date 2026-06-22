import { supabase } from '@/lib/supabaseClient';

export type ImageProfile =
  | 'blog-cover'
  | 'blog-content'
  | 'member-photo'
  | 'product-cover'
  | 'product-gallery'
  | 'promotional-banner';

interface ProfileConfig {
  aspectRatio: number | null;
  maxWidth: number;
  maxHeight: number | null;
  quality: number;
  defaultFormat: 'webp' | 'png';
  bucket: string;
  folder: string;
  label: string;
}

const profiles: Record<ImageProfile, ProfileConfig> = {
  'blog-cover': {
    aspectRatio: 16 / 9,
    maxWidth: 1600,
    maxHeight: null,
    quality: 0.86,
    defaultFormat: 'webp',
    bucket: 'blog-crescer',
    folder: 'posts/covers',
    label: 'Capa de Blog',
  },
  'blog-content': {
    aspectRatio: null,
    maxWidth: 1400,
    maxHeight: null,
    quality: 0.86,
    defaultFormat: 'webp',
    bucket: 'blog-crescer',
    folder: 'posts/content',
    label: 'Imagem de Conteúdo',
  },
  'member-photo': {
    aspectRatio: 1,
    maxWidth: 900,
    maxHeight: 900,
    quality: 0.84,
    defaultFormat: 'webp',
    bucket: 'members',
    folder: 'members',
    label: 'Foto de Membro',
  },
  'product-cover': {
    aspectRatio: 4 / 3,
    maxWidth: 1400,
    maxHeight: null,
    quality: 0.86,
    defaultFormat: 'webp',
    bucket: 'products',
    folder: 'covers',
    label: 'Capa de Produto',
  },
  'product-gallery': {
    aspectRatio: 1,
    maxWidth: 1200,
    maxHeight: null,
    quality: 0.84,
    defaultFormat: 'webp',
    bucket: 'products',
    folder: 'gallery',
    label: 'Galeria de Produto',
  },
  'promotional-banner': {
    aspectRatio: 4,
    maxWidth: 1920,
    maxHeight: null,
    quality: 0.88,
    defaultFormat: 'webp',
    bucket: 'promotional-banner',
    folder: 'banners',
    label: 'Banner Promocional',
  },
};

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getProfileConfig(profile: ImageProfile): ProfileConfig {
  return profiles[profile];
}

export function getProfileAspectRatio(profile: ImageProfile): number | null {
  return profiles[profile].aspectRatio;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function cropCanvas(
  source: CanvasImageSource,
  crop: CropData
): HTMLCanvasElement {
  const canvas = createCanvas(crop.width, crop.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.drawImage(
    source,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );
  return canvas;
}

function resizeCanvas(
  canvas: HTMLCanvasElement,
  maxWidth: number,
  maxHeight: number | null
): HTMLCanvasElement {
  let { width, height } = canvas;

  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height = height * ratio;
  }

  if (maxHeight !== null && height > maxHeight) {
    const ratio = maxHeight / height;
    height = maxHeight;
    width = width * ratio;
  }

  if (Math.round(width) === canvas.width && Math.round(height) === canvas.height) {
    return canvas;
  }

  const resized = createCanvas(Math.round(width), Math.round(height));
  const ctx = resized.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  ctx.drawImage(canvas, 0, 0, resized.width, resized.height);
  return resized;
}

function hasTransparency(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to convert canvas to blob'));
      },
      format,
      quality
    );
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function processImage(
  file: File,
  profile: ImageProfile,
  cropData?: CropData
): Promise<{ blob: Blob; fileName: string; format: string; originalSize: number; finalSize: number }> {
  if (file.type === 'image/svg+xml') {
    return {
      blob: file,
      fileName: `${Date.now()}-${file.name}`,
      format: 'image/svg+xml',
      originalSize: file.size,
      finalSize: file.size,
    };
  }

  const config = profiles[profile];
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await loadImage(dataUrl);
  const { width: origWidth, height: origHeight } = img;

  let canvas: HTMLCanvasElement;

  if (cropData) {
    const safeCrop = {
      x: Math.max(0, cropData.x),
      y: Math.max(0, cropData.y),
      width: Math.min(cropData.width, origWidth - cropData.x),
      height: Math.min(cropData.height, origHeight - cropData.y),
    };
    canvas = cropCanvas(img, safeCrop);
  } else {
    canvas = createCanvas(origWidth, origHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    ctx.drawImage(img, 0, 0);
  }

  canvas = resizeCanvas(canvas, config.maxWidth, config.maxHeight);

  let format = `image/${config.defaultFormat}`;
  if (config.defaultFormat === 'webp' && file.type === 'image/png') {
    if (hasTransparency(canvas)) {
      format = 'image/png';
    }
  }

  const blob = await canvasToBlob(canvas, format, config.quality);
  const ext = format === 'image/png' ? 'png' : 'webp';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  return {
    blob,
    fileName,
    format,
    originalSize: file.size,
    finalSize: blob.size,
  };
}

async function uploadProcessedImage(
  blob: Blob,
  fileName: string,
  bucket: string,
  folder: string,
  format: string
): Promise<string> {
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, blob, {
      contentType: format,
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    if (uploadError.message.includes('not found') || uploadError.message.includes('The resource was not found')) {
      throw new Error(`O bucket "${bucket}" não foi encontrado no Supabase Storage.`);
    }
    throw new Error(uploadError.message || 'Erro ao enviar imagem.');
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function uploadImage(
  file: File,
  profile: ImageProfile,
  cropData?: CropData
): Promise<{ url: string; originalSize: number; finalSize: number }> {
  const config = profiles[profile];
  const { blob, fileName, format, originalSize, finalSize } = await processImage(
    file,
    profile,
    cropData
  );
  const url = await uploadProcessedImage(blob, fileName, config.bucket, config.folder, format);
  return { url, originalSize, finalSize };
}

export const imageService = {
  uploadImage,
  processImage,
};