import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { 
  Type, 
  Heading1, 
  Heading2, 
  Bold, 
  List, 
  ListOrdered, 
  Quote,
  Undo,
  Redo
} from 'lucide-react';

interface SimpleHTMLEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SimpleHTMLEditor: React.FC<SimpleHTMLEditorProps> = ({
  value,
  onChange,
  placeholder,
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    
    if (command === 'formatBlock') {
      document.execCommand(command, false, value);
    } else if (command === 'insertHTML' && value) {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false, value || undefined);
    }
    
    handleInput();
  };

  const ToolbarButton = ({
    icon: Icon,
    title,
    onClick,
    active
  }: {
    icon: React.ElementType;
    title: string;
    onClick: () => void;
    active?: boolean;
  }) => (
    <Button
      type="button"
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      className="h-8 w-8 p-0"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  if (!isMounted) {
    return <div className={className}>Carregando editor...</div>;
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <ToolbarButton
          icon={Undo}
          title="Desfazer"
          onClick={() => execCommand('undo')}
        />
        <ToolbarButton
          icon={Redo}
          title="Refazer"
          onClick={() => execCommand('redo')}
        />
        
        <div className="w-px bg-gray-300 mx-1" />
        
        <ToolbarButton
          icon={Type}
          title="Parágrafo"
          onClick={() => execCommand('formatBlock', '<p>')}
        />
        <ToolbarButton
          icon={Heading1}
          title="Título 1"
          onClick={() => execCommand('formatBlock', '<h1>')}
        />
        <ToolbarButton
          icon={Heading2}
          title="Título 2"
          onClick={() => execCommand('formatBlock', '<h2>')}
        />
        
        <div className="w-px bg-gray-300 mx-1" />
        
        <ToolbarButton
          icon={Bold}
          title="Negrito"
          onClick={() => execCommand('bold')}
        />
        
        <div className="w-px bg-gray-300 mx-1" />
        
        <ToolbarButton
          icon={List}
          title="Lista com marcadores"
          onClick={() => execCommand('insertUnorderedList')}
        />
        <ToolbarButton
          icon={ListOrdered}
          title="Lista numerada"
          onClick={() => execCommand('insertOrderedList')}
        />
        <ToolbarButton
          icon={Quote}
          title="Citação"
          onClick={() => execCommand('formatBlock', '<blockquote>')}
        />
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[400px] p-4 prose prose-sm max-w-none focus:outline-none"
        style={{
          fontSize: '16px',
          lineHeight: '1.6'
        }}
        suppressContentEditableWarning
      >
        {placeholder && !value && (
          <span className="text-gray-400 pointer-events-none">{placeholder}</span>
        )}
      </div>
    </div>
  );
};

export default SimpleHTMLEditor;