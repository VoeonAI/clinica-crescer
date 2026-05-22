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
  Plus, 
  Type, 
  AlignLeft, 
  List, 
  Image as ImageIcon,
  Clipboard,
  Bold,
  Italic,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type BlockType = 'heading' | 'paragraph' | 'list' | 'image';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  altText?: string;
  imageUrl?: string;
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

  // Parse HTML inicial para blocos
  useEffect(() => {
    if (value && blocks.length === 0) {
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

  const parseHTMLToBlocks = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const newBlocks: Block[] = [];

    Array.from(tempDiv.children).forEach((child, index) => {
      const id = child.id || `block-${Date.now()}-${index}`;
      
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
        const items = Array.from(child.querySelectorAll('li')).map(li => li.textContent || '');
        newBlocks.push({
          id,
          type: 'list',
          content: items.join('\n'),
        });
      } else if (child.tagName === 'IMG') {
        newBlocks.push({
          id,
          type: 'image',
          imageUrl: (child as HTMLImageElement).src,
          altText: (child as HTMLImageElement).alt || '',
          content: '',
        });
      }
    });

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
          return `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
        case 'image':
          return block.imageUrl 
            ? `<img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.altText || '')}" class="w-full rounded-lg my-4" />`
            : '';
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

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      setBlocks(newBlocks);
    }
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

  const formatParagraphSelection = (blockId: string, tag: 'strong' | 'em', isSelection: boolean) => {
    // Para seleção, vamos simplificar e aplicar ao texto selecionado
    // Em uma implementação completa, usariamos Selection API
    const block = blocks.find(b => b.id === blockId);
    if (!block || block.type !== 'paragraph') return;

    if (isSelection) {
      // Como estamos usando textarea, não podemos formatar seleção facilmente
      // Vou adicionar um alerta para o usuário
      alert('Para formatar parte do texto, use o botão "Bloco Inteiro" ou use a prévia para editar manualmente');
      return;
    }

    // Aplica ao bloco inteiro
    const openTag = tag === 'strong' ? '<strong>' : '<em>';
    const closeTag = tag === 'strong' ? '</strong>' : '</em>';
    
    // Remove tags existentes para evitar duplicação
    let cleanContent = block.content
      .replace(/<\/?strong>/g, '')
      .replace(/<\/?em>/g, '');
    
    updateBlock(blockId, { content: `${openTag}${cleanContent}${closeTag}` });
  };

  const renderBlockEditor = (block: Block, index: number) => {
    const isFirst = index === 0;
    const isLast = index === blocks.length - 1;

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
              {block.type === 'list' && 'Lista'}
              {block.type === 'image' && 'Imagem'}
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
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Digite o parágrafo..."
                rows={4}
                className="mb-3"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    formatParagraphSelection(block.id, 'strong', false);
                  }}
                >
                  <Bold className="w-4 h-4 mr-2" />
                  Bloco Negrito
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    formatParagraphSelection(block.id, 'em', false);
                  }}
                >
                  <Italic className="w-4 h-4 mr-2" />
                  Bloco Itálico
                </Button>
              </div>
            </div>
          )}

          {block.type === 'list' && (
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Digite os itens da lista (um por linha)..."
              rows={6}
            />
          )}

          {block.type === 'image' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor={`url-${block.id}`}>URL da Imagem *</Label>
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
      <div className="prose prose-lg max-w-none">
        {blocks.map((block, index) => {
          switch (block.type) {
            case 'heading':
              return <h2 key={block.id} className="text-2xl font-bold mb-4">{block.content}</h2>;
            case 'paragraph':
              return <p key={block.id} className="mb-4" dangerouslySetInnerHTML={{ __html: block.content }} />;
            case 'list':
              const items = block.content.split('\n').filter(item => item.trim());
              return (
                <ul key={block.id} className="list-disc pl-6 mb-4 space-y-2">
                  {items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              );
            case 'image':
              return block.imageUrl ? (
                <img 
                  key={block.id}
                  src={block.imageUrl} 
                  alt={block.altText} 
                  className="w-full rounded-lg my-6"
                />
              ) : null;
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
      {/* Header com botão de preview */}
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
          {/* Botões para adicionar blocos */}
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

          {/* Lista de blocos */}
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