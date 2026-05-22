import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Type, 
  AlignLeft, 
  List, 
  ListOrdered,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Clipboard,
  Bold,
  Italic,
  Eye,
  EyeOff,
  Youtube
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { blogService } from '@/services/blogService';
import { showSuccess, showError } from '@/utils/toast';

export type BlockType = 'heading' | 'paragraph' | 'list' | 'image' | 'video';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  altText?: string;
  imageUrl?: string;
  videoUrl?: string;
  listType?: 'bulleted' | 'numbered';
}

interface BlockEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ value, onChange, placeholder }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const dragOverIndex = useRef<number | null>(null);

  // Refs para textarea
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const linkUrlRef = useRef<HTMLInputElement>(null);
  const linkBlockIdRef = useRef<string | null>(null);

  // Parse HTML inicial para blocos
  useEffect(() => {
    if (value) {
      parseHTMLToBlocks(value);
    }
  }, [value]);

  // Converter blocos para HTML
  useEffect(() => {
    if (blocks.length > 0) {
      const html = blocksToHTML(blocks);
      onChange(html);
    }
  }, [blocks]);

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[match.length - 1] && match[match.length - 1].length === 11) {
        return match[match.length - 1];
      }
    }
    
    return null;
  };

  const parseHTMLToBlocks = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const newBlocks: Block[] = [];

    // Função auxiliar para processar filhos recursivamente
    const processChildren = (element: Element) => {
      Array.from(element.children).forEach((child, index) => {
        const id = child.id || `block-${Date.now()}-${index}-${Math.random()}`;
        
        // Verificar se é uma div wrapper de vídeo
        if (child.tagName === 'DIV' && child.classList.contains('video-container')) {
          const iframe = child.querySelector('iframe');
          if (iframe) {
            const youtubeId = extractYouTubeId(iframe.src);
            if (youtubeId) {
              newBlocks.push({
                id,
                type: 'video',
                videoUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
                content: '',
              });
              return; // Não processar filhos dessa div
            }
          }
        }
        
        if (child.tagName === 'H2') {
          newBlocks.push({
            id,
            type: 'heading',
            content: child.textContent || '',
          });
        } else if (child.tagName === 'P') {
          newBlocks.push({
            id,
            type: 'paragraph',
            content: child.innerHTML || '',
          });
        } else if (child.tagName === 'UL') {
          const items = Array.from(child.querySelectorAll('li')).map(li => li.innerHTML || li.textContent || '');
          newBlocks.push({
            id,
            type: 'list',
            content: items.join('\n'),
            listType: 'bulleted',
          });
        } else if (child.tagName === 'OL') {
          const items = Array.from(child.querySelectorAll('li')).map(li => li.innerHTML || li.textContent || '');
          newBlocks.push({
            id,
            type: 'list',
            content: items.join('\n'),
            listType: 'numbered',
          });
        } else if (child.tagName === 'IMG') {
          newBlocks.push({
            id,
            type: 'image',
            imageUrl: (child as HTMLImageElement).src,
            altText: (child as HTMLImageElement).alt || '',
            content: '',
          });
        } else if (child.tagName === 'IFRAME') {
          const iframe = child as HTMLIFrameElement;
          const youtubeId = extractYouTubeId(iframe.src);
          if (youtubeId) {
            newBlocks.push({
              id,
              type: 'video',
              videoUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
              content: '',
            });
          }
        }
        
        // Processar filhos recursivamente para aninhamentos
        if (child.children.length > 0) {
          processChildren(child);
        }
      });
    };

    processChildren(tempDiv);

    // Atualizar blocks se encontrou novos
    if (newBlocks.length > 0) {
      setBlocks(newBlocks);
    }
  };

  const blocksToHTML = (blocksToConvert: Block[]): string => {
    return blocksToConvert.map(block => {
      switch (block.type) {
        case 'heading':
          return `<h2>${escapeHtml(block.content)}</h2>`;
        case 'paragraph':
          return `<p>${block.content}</p>`;
        case 'list':
          const items = block.content.split('\n').filter(item => item.trim());
          const listTag = block.listType === 'numbered' ? 'ol' : 'ul';
          return `<${listTag}>${items.map(item => `<li>${item}</li>`).join('')}</${listTag}>`;
        case 'image':
          return block.imageUrl 
            ? `<img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.altText || '')}" class="w-full rounded-lg my-4" />`
            : '';
        case 'video':
          if (block.videoUrl) {
            const videoId = extractYouTubeId(block.videoUrl);
            if (videoId) {
              return `<div class="video-container my-6"><iframe src="https://www.youtube.com/embed/${videoId}" title="Vídeo do YouTube" loading="lazy" allowfullscreen></iframe></div>`;
            }
          }
          return '';
        default:
          return '';
      }
    }).join('\n');
  };

  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      listType: type === 'list' ? 'bulleted' : undefined,
    };
    setBlocks([...blocks, newBlock]);
    setShowPreview(false);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  // Função segura de mover bloco
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    // Impedir mover index 0 para cima ou último para baixo
    if (newIndex < 0 || newIndex >= blocks.length) {
      return;
    }

    // Copiar array
    const updated = [...blocks];
    
    // Swap seguro manual
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    // Filtrar para garantir que nenhum bloco undefined foi introduzido
    const cleanBlocks = updated.filter(Boolean);

    // Atualizar estado
    setBlocks(cleanBlocks);
  };

  const handlePasteText = (text: string) => {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    const newBlocks: Block[] = paragraphs.map((p, i) => ({
      id: `block-${Date.now()}-${i}`,
      type: 'paragraph' as BlockType,
      content: escapeHtml(p.trim()),
    }));
    setBlocks([...blocks, ...newBlocks]);
    setShowPreview(false);
  };

  const applyFormatToSelection = (blockId: string, tag: 'strong' | 'em' | 'a', href?: string) => {
    const textarea = textareaRefs.current[blockId];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end) {
      showError('Selecione o texto para formatar');
      return;
    }

    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    let replacement: string;
    if (tag === 'a' && href) {
      replacement = `<a href="${href}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;
    } else {
      const openTag = tag === 'strong' ? '<strong>' : '<em>';
      const closeTag = tag === 'strong' ? '</strong>' : '</em>';
      replacement = `${openTag}${selectedText}${closeTag}`;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    
    updateBlock(blockId, { content: newText });
    
    setTimeout(() => {
      const textareaUpdated = textareaRefs.current[blockId];
      if (textareaUpdated) {
        textareaUpdated.focus();
      }
    }, 0);
  };

  const applyFormatToWholeBlock = (blockId: string, tag: 'strong' | 'em') => {
    const block = blocks.find(b => b.id === blockId);
    if (!block || block.type !== 'paragraph') return;

    const openTag = tag === 'strong' ? '<strong>' : '<em>';
    const closeTag = tag === 'strong' ? '</strong>' : '</em>';
    
    let cleanContent = block.content
      .replace(/<\/?strong>/g, '')
      .replace(/<\/?em>/g, '')
      .replace(/<a[^>]*>(.*?)<\/a>/g, '$1');
    
    updateBlock(blockId, { content: `${openTag}${cleanContent}${closeTag}` });
  };

  const openLinkDialog = (blockId: string) => {
    const textarea = textareaRefs.current[blockId];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end) {
      showError('Selecione o texto para criar um link');
      return;
    }

    linkBlockIdRef.current = blockId;
    if (linkUrlRef.current) {
      linkUrlRef.current.value = '';
      linkUrlRef.current.focus();
    }
  };

  const applyLink = () => {
    const url = linkUrlRef.current?.value.trim();
    const blockId = linkBlockIdRef.current;
    
    if (!blockId || !url) {
      showError('Informe uma URL válida');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      showError('A URL deve começar com http:// ou https://');
      return;
    }

    applyFormatToSelection(blockId, 'a', url);
    
    if (linkUrlRef.current) {
      linkUrlRef.current.value = '';
    }
    linkBlockIdRef.current = null;
  };

  const handleImageUpload = async (blockId: string, file: File) => {
    try {
      const imageUrl = await blogService.uploadBlogImage(file);
      updateBlock(blockId, { imageUrl });
      showSuccess('Imagem enviada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao enviar imagem:', error);
      // Mostrar erro mais amigável
      const errorMsg = error.message || 'Erro ao enviar imagem';
      
      if (errorMsg.includes('bucket') || errorMsg.includes('storage')) {
        showError('Erro de acesso ao Storage. Verifique se o bucket "blog-crescer" existe e as permissões estão configuradas.');
      } else if (errorMsg.includes('policy') || errorMsg.includes('RLS')) {
        showError('Erro de permissão. Verifique as políticas RLS do Supabase Storage.');
      } else {
        showError(errorMsg);
      }
    }
  };

  const renderBlockEditor = (block: Block, index: number) => {
    // Guard: Se o bloco for inválido, não renderiza nada
    if (!block) {
      return null;
    }

    const isFirst = index === 0;
    const isLast = index === blocks.length - 1;
    const showLinkDialog = linkBlockIdRef.current === block.id;

    return (
      <Card 
        key={block.id}
        className={cn(
          "mb-4 transition-all",
          dragOverIndex === index && "border-primary"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              {block.type === 'heading' && 'Título (H2)'}
              {block.type === 'paragraph' && 'Parágrafo'}
              {block.type === 'list' && `Lista (${block.listType === 'numbered' ? 'numerada' : 'marcadores'})`}
              {block.type === 'image' && 'Imagem'}
              {block.type === 'video' && 'Vídeo YouTube'}
            </span>
            <div className="flex-1" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.preventDefault();
                moveBlock(index, 'up');
              }}
              disabled={isFirst}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.preventDefault();
                moveBlock(index, 'down');
              }}
              disabled={isLast}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={(e) => {
                e.preventDefault();
                deleteBlock(block.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {block.type === 'heading' && (
            <Input
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Digite o subtítulo..."
              className="text-lg font-semibold"
            />
          )}

          {block.type === 'paragraph' && (
            <div>
              <Textarea
                ref={(el) => { textareaRefs.current[block.id] = el; }}
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Digite o parágrafo..."
                rows={4}
                className="mb-3"
              />
              <div className="flex flex-wrap gap-2 mb-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormatToSelection(block.id, 'strong');
                  }}
                >
                  <Bold className="w-4 h-4 mr-2" />
                  B seleção
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormatToSelection(block.id, 'em');
                  }}
                >
                  <Italic className="w-4 h-4 mr-2" />
                  I seleção
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    openLinkDialog(block.id);
                  }}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Link
                </Button>
              </div>
              {showLinkDialog && (
                <div className="flex gap-2 p-3 bg-muted rounded-md">
                  <Input
                    ref={linkUrlRef}
                    placeholder="https://exemplo.com"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        applyLink();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      applyLink();
                    }}
                  >
                    Aplicar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      linkBlockIdRef.current = null;
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormatToWholeBlock(block.id, 'strong');
                  }}
                >
                  <Bold className="w-4 h-4 mr-2" />
                  B bloco inteiro
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormatToWholeBlock(block.id, 'em');
                  }}
                >
                  <Italic className="w-4 h-4 mr-2" />
                  I bloco inteiro
                </Button>
              </div>
            </div>
          )}

          {block.type === 'list' && (
            <div>
              <div className="flex gap-2 mb-3">
                <Button
                  type="button"
                  variant={block.listType === 'bulleted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    updateBlock(block.id, { listType: 'bulleted' });
                  }}
                >
                  <List className="w-4 h-4 mr-2" />
                  Marcadores
                </Button>
                <Button
                  type="button"
                  variant={block.listType === 'numbered' ? 'default' : 'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    updateBlock(block.id, { listType: 'numbered' });
                  }}
                >
                  <ListOrdered className="w-4 h-4 mr-2" />
                  Numerada
                </Button>
              </div>
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Digite os itens da lista (um por linha)..."
                rows={6}
              />
            </div>
          )}

          {block.type === 'image' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor={`upload-${block.id}`}>Upload de Imagem</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id={`upload-${block.id}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      e.preventDefault();
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(block.id, file);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`upload-${block.id}`)?.click();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor={`url-${block.id}`}>OU URL da Imagem</Label>
                <Input
                  id={`url-${block.id}`}
                  value={block.imageUrl || ''}
                  onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor={`alt-${block.id}`}>Texto Alternativo (Alt) *</Label>
                <Input
                  id={`alt-${block.id}`}
                  value={block.altText || ''}
                  onChange={(e) => updateBlock(block.id, { altText: e.target.value })}
                  placeholder="Descrição da imagem para SEO e acessibilidade"
                />
              </div>
              {block.imageUrl && (
                <img 
                  src={block.imageUrl} 
                  alt={block.altText} 
                  className="w-full max-h-64 object-contain rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          )}

          {block.type === 'video' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor={`video-${block.id}`}>URL do YouTube *</Label>
                <Input
                  id={`video-${block.id}`}
                  value={block.videoUrl || ''}
                  onChange={(e) => updateBlock(block.id, { videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos aceitos: youtube.com/watch?v=ID, youtu.be/ID
                </p>
              </div>
              {block.videoUrl && extractYouTubeId(block.videoUrl) && (
                <div className="aspect-video rounded-lg overflow-hidden border">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(block.videoUrl)}`}
                    title="Preview do vídeo"
                    loading="lazy"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderPreview = () => {
    if (blocks.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          {placeholder || 'Nenhum conteúdo adicionado ainda.'}
        </div>
      );
    }

    return (
      <div className="blog-content">
        {blocks.map((block, index) => {
          // Guard: Ignorar blocos inválidos no preview
          if (!block) return null;

          switch (block.type) {
            case 'heading':
              return <h2 key={block.id}>{block.content}</h2>;
            case 'paragraph':
              return <p key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} />;
            case 'list':
              const items = block.content.split('\n').filter(item => item.trim());
              const ListTag = block.listType === 'numbered' ? 'ol' : 'ul';
              return (
                <ListTag key={block.id}>
                  {items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}
                </ListTag>
              );
            case 'image':
              return block.imageUrl ? (
                <img 
                  key={block.id}
                  src={block.imageUrl} 
                  alt={block.altText} 
                />
              ) : null;
            case 'video':
              if (block.videoUrl) {
                const videoId = extractYouTubeId(block.videoUrl);
                if (videoId) {
                  return (
                    <div key={block.id} className="video-container">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="Vídeo do YouTube"
                        loading="lazy"
                        allowFullScreen
                      />
                    </div>
                  );
                }
              }
              return null;
            default:
              return null;
          }
        })}
      </div>
    );
  };

  const PasteTextDialog = ({ onClose }: { onClose: () => void }) => {
    const [text, setText] = useState('');

    const handlePaste = () => {
      if (text.trim()) {
        handlePasteText(text);
        onClose();
      }
    };

    return (
      <Card className="mb-4 border-primary">
        <CardHeader>
          <CardTitle className="text-lg">Colar Texto</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole seu texto aqui. Parágrafos separados por linha em branco serão convertidos em blocos separados..."
            rows={8}
            className="mb-4"
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={(e) => {
              e.preventDefault();
              onClose();
            }}>Cancelar</Button>
            <Button type="button" onClick={(e) => {
              e.preventDefault();
              handlePaste();
            }}>Adicionar</Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const [showPasteDialog, setShowPasteDialog] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="border-b bg-gray-50 p-4 flex items-center justify-between">
        <h3 className="font-semibold">Editor por Blocos</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            setShowPreview(!showPreview);
          }}
        >
          {showPreview ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Editar
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </>
          )}
        </Button>
      </div>

      {showPreview ? (
        <div className="p-8 bg-white min-h-[400px]">
          {renderPreview()}
        </div>
      ) : (
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                addBlock('heading');
              }}
            >
              <Type className="w-4 h-4 mr-2" />
              Título (H2)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                addBlock('paragraph');
              }}
            >
              <AlignLeft className="w-4 h-4 mr-2" />
              Parágrafo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                addBlock('list');
              }}
            >
              <List className="w-4 h-4 mr-2" />
              Lista
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                addBlock('image');
              }}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Imagem
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                addBlock('video');
              }}
            >
              <Youtube className="w-4 h-4 mr-2" />
              Vídeo YouTube
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setShowPasteDialog(true);
              }}
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Colar Texto
            </Button>
          </div>

          {showPasteDialog && (
            <PasteTextDialog onClose={() => setShowPasteDialog(false)} />
          )}

          {blocks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <p className="mb-2">{placeholder || 'Nenhum bloco adicionado ainda.'}</p>
              <p className="text-sm">Use os botões acima para adicionar conteúdo</p>
            </div>
          ) : (
            blocks.map((block, index) => renderBlockEditor(block, index))
          )}
        </div>
      )}
    </div>
  );
};

export default BlockEditor;