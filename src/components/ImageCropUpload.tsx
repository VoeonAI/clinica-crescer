import { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  imageService,
  ImageProfile,
  CropData,
  formatBytes,
  getProfileConfig,
  getProfileAspectRatio,
} from '@/services/imageService';
import { Upload, X, ImagePlus, ZoomIn, Check } from 'lucide-react';
import { showError } from '@/utils/toast';

interface ImageCropUploadProps {
  profile: ImageProfile;
  onUploadComplete: (url: string) => void;
  onUploadAllComplete?: (urls: string[]) => void;
  onUploadError?: (error: Error) => void;
  buttonText?: string;
  disabled?: boolean;
  existingUrl?: string | null;
  onRemove?: () => void;
  className?: string;
  multiple?: boolean;
}

const getPreviewStyle = (aspectRatio: number | null): React.CSSProperties => {
  if (aspectRatio === null) {
    return { width: 192, height: 192, objectFit: 'cover' as const };
  }
  const height = Math.max(48, Math.min(192, Math.round(192 / aspectRatio)));
  return { width: Math.round(height * aspectRatio), height, objectFit: 'cover' as const };
};

export default function ImageCropUpload({
  profile,
  onUploadComplete,
  onUploadAllComplete,
  onUploadError,
  buttonText = 'Selecionar imagem',
  disabled = false,
  existingUrl,
  onRemove,
  className,
  multiple = false,
}: ImageCropUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [finalSize, setFinalSize] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const pendingFilesRef = useRef<File[]>([]);
  const completedUrlsRef = useRef<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = getProfileConfig(profile);
  const aspectRatio = getProfileAspectRatio(profile);
  const needsCrop = aspectRatio !== null;

  const processNext = async () => {
    const files = pendingFilesRef.current;
    if (files.length === 0) {
      const urls = [...completedUrlsRef.current];
      setIsUploading(false);
      setIsOpen(false);
      setImageSrc(null);
      setCurrentFile(null);
      if (urls.length > 0) {
        onUploadAllComplete?.(urls);
      }
      return;
    }

    const [next, ...rest] = files;
    pendingFilesRef.current = rest;
    setCurrentFile(next);
    setCurrentIndex((prev) => prev + 1);
    setOriginalSize(next.size);
    setCroppedAreaPixels(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(next);
      });

      setImageSrc(dataUrl);

      if (needsCrop) {
        setIsOpen(true);
        setIsUploading(false);
      } else {
        setIsUploading(true);
        const result = await imageService.uploadImage(next, profile);
        completedUrlsRef.current.push(result.url);
        setFinalSize(result.finalSize);
        onUploadComplete(result.url);
        await processNext();
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Erro ao processar imagem');
      onUploadError?.(err);
      showError(err.message);
      await processNext();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    pendingFilesRef.current = fileArray;
    completedUrlsRef.current = [];
    setCurrentIndex(0);
    setTotalCount(fileArray.length);
    setIsUploading(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    processNext();
  };

  const handleConfirmCrop = async () => {
    if (!currentFile || !croppedAreaPixels) return;

    const cropData: CropData = {
      x: croppedAreaPixels.x,
      y: croppedAreaPixels.y,
      width: croppedAreaPixels.width,
      height: croppedAreaPixels.height,
    };

    try {
      setIsUploading(true);
      setIsOpen(false);
      setImageSrc(null);
      const result = await imageService.uploadImage(currentFile, profile, cropData);
      completedUrlsRef.current.push(result.url);
      setFinalSize(result.finalSize);
      onUploadComplete(result.url);
      await processNext();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Erro ao enviar imagem');
      onUploadError?.(err);
      showError(err.message);
      setIsUploading(false);
      setIsOpen(false);
      setImageSrc(null);
      setCurrentFile(null);
      await processNext();
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setImageSrc(null);
    setCurrentFile(null);
    pendingFilesRef.current = [];
    completedUrlsRef.current = [];
    setIsUploading(false);
  };

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  if (existingUrl) {
    const previewStyle = getPreviewStyle(aspectRatio);
    return (
      <div className={className}>
        <div className="relative inline-block rounded-lg border overflow-hidden">
          <img
            src={existingUrl}
            alt="Preview"
            style={previewStyle}
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-7 w-7"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              <ImagePlus className="w-3 h-3" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-7 w-7"
              onClick={onRemove}
              disabled={disabled}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        disabled={disabled || isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? 'Processando...' : buttonText}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
      />

      <Dialog open={isOpen} onOpenChange={(open) => !open && !isUploading && handleCancel()}>
        <DialogContent className="max-w-3xl w-[95vw]">
          <DialogHeader>
            <DialogTitle>
              Ajustar enquadramento — {config.label}
              {totalCount > 1 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({currentIndex} de {totalCount})
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {aspectRatio !== null && (
                <span>Proporção: {aspectRatio >= 1 ? `${aspectRatio.toFixed(2)}:1` : `1:${(1 / aspectRatio).toFixed(2)}`}</span>
              )}
              {aspectRatio === null && (
                <span>Proporção: Livre</span>
              )}
              {originalSize > 0 && (
                <span>Original: {formatBytes(originalSize)}</span>
              )}
              {finalSize > 0 && (
                <span>Final: {formatBytes(finalSize)}</span>
              )}
            </div>

            <div className="relative w-full h-64 sm:h-80 bg-black/5 rounded-lg overflow-hidden">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio ?? undefined}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  showGrid={true}
                  cropShape="rect"
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-muted-foreground" />
                <Label className="text-sm">Zoom</Label>
              </div>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={1}
                max={3}
                step={0.1}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isUploading}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleConfirmCrop}
                disabled={isUploading || !croppedAreaPixels}
              >
                <Check className="w-4 h-4 mr-2" />
                {isUploading ? 'Processando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}