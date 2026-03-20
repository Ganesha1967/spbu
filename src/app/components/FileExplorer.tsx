import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  url?: string;
}

interface FileExplorerProps {
  files: FileNode[];
}

function FileItem({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === 'folder';

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else if (node.url) {
      window.open(node.url, '_blank');
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-[#1c2128] cursor-pointer transition-colors group"
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        {isFolder ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            <Folder className="w-4 h-4 text-purple-400" />
          </>
        ) : (
          <>
            <div className="w-4" />
            <File className="w-4 h-4 text-blue-400" />
          </>
        )}
        <span className="text-sm text-foreground group-hover:text-purple-400 transition-colors">
          {node.name}
        </span>
      </div>
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child, idx) => (
            <FileItem key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files }: FileExplorerProps) {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-2">
      {files.map((file, idx) => (
        <FileItem key={idx} node={file} />
      ))}
    </div>
  );
}
