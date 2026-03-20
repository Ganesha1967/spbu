import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FileExplorer, FileNode } from './FileExplorer';
import { motion } from 'motion/react';

export interface Subject {
  id: string;
  name: string;
  status: 'ready' | 'in-progress';
  description: string;
  files: FileNode[];
}

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-foreground mb-2">{subject.name}</h3>
            <p className="text-sm text-muted-foreground">{subject.description}</p>
          </div>
          <div>
            {subject.status === 'ready' ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                Ready
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                In Progress
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-md text-white transition-all"
        >
          {isExpanded ? (
            <>
              <span>Скрыть файлы</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Посмотреть материалы</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-[#30363d] p-4"
        >
          <FileExplorer files={subject.files} />
        </motion.div>
      )}
    </motion.div>
  );
}
