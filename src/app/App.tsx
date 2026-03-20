import { useState, useMemo, useEffect } from 'react';
import { BookOpen, FolderOpen, Folder, ChevronRight, ChevronDown, File, ExternalLink, ExpandIcon, MinimizeIcon, Pin } from 'lucide-react';
import { SearchBar } from './components/SearchBar';

const semesters = {
  1: [
    {
      id: '1-matan',
      name: 'Математический анализ',
      status: 'ready' as const,
      description: 'Пределы, производные, интегралы и ряды',
      files: [
        {
          name: 'Материалы',
          type: 'folder' as const,
          children: [
            { name: 'Матан - Лекция 1.pdf', type: 'file' as const, url: 'docs/sem-1/matan/matan-1.pdf' },
            { name: 'Исходник (.tex)', type: 'file' as const, url: 'docs/sem-1/matan/matan-1.tex' },
          ],
        },
      ],
    },
    {
      id: '1-algebra',
      name: 'Алгебра',
      status: 'ready' as const,
      description: 'Матрицы, системы линейных уравнений, группы',
      files: [
        {
          name: 'Лекции',
          type: 'folder' as const,
          children: [
            { name: 'Алгебра - Лекция 1.pdf', type: 'file' as const, url: 'docs/sem-1/algebra/algebra-1.pdf' },
            { name: 'Исходник (.tex)', type: 'file' as const, url: 'docs/sem-1/algebra/algebra-1.tex' },
          ],
        },
      ],
    },
    {
      id: '1-diskra',
      name: 'Дискретная математика',
      status: 'ready' as const,
      description: 'Множества, логика, комбинаторика',
      files: [
        {
          name: 'Конспекты',
          type: 'folder' as const,
          children: [
            { name: 'Дискретка - Лекция 1.pdf', type: 'file' as const, url: 'docs/sem-1/diskra/diskra-1.pdf' },
            { name: 'Исходник (.tex)', type: 'file' as const, url: 'docs/sem-1/diskra/diskra-1.tex' },
          ],
        },
      ],
    },
  ],
  2: [
    {
      id: '2-proga',
      name: 'Программирование',
      status: 'in-progress' as const,
      description: 'Алгоритмы, C++, Kotlin и командная разработка',
      files: [
        {
          name: 'Разделы',
          type: 'folder' as const,
          children: [
            { name: 'Алгоритмы (скоро)', type: 'file' as const, url: '#' },
            { name: 'Архитектура ЭВМ (скоро)', type: 'file' as const, url: '#' },
          ],
        },
      ],
    },
    {
      id: '2-matan',
      name: 'Математический анализ II',
      status: 'in-progress' as const,
      description: 'ФНП, кратные интегралы',
      files: [
        { name: 'Материалы появятся позже', type: 'file' as const, url: '#' },
      ],
    },
  ],
  3: [],
};

export default function App() {
  const [activeSemester, setActiveSemester] = useState<1 | 2 | 3 | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [pinnedSubjects, setPinnedSubjects] = useState<Set<string>>(new Set());

  // Глобальный поиск по всем семестрам
  const filteredSubjects = useMemo(() => {
    let allSubjects: Array<{ semester: number; subject: any }> = [];
    
    if (activeSemester === 'all') {
      Object.entries(semesters).forEach(([sem, subjects]) => {
        subjects.forEach(subject => {
          allSubjects.push({ semester: Number(sem), subject });
        });
      });
    } else {
      semesters[activeSemester].forEach(subject => {
        allSubjects.push({ semester: activeSemester, subject });
      });
    }

    if (searchQuery.trim()) {
      allSubjects = allSubjects.filter(
        ({ subject }) =>
          subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subject.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Сортировка: закрепленные предметы в начале
    allSubjects.sort((a, b) => {
      const aIsPinned = pinnedSubjects.has(a.subject.id);
      const bIsPinned = pinnedSubjects.has(b.subject.id);
      
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return 0;
    });

    return allSubjects;
  }, [activeSemester, searchQuery, pinnedSubjects]);

  // Подсчет статистики
  const stats = useMemo(() => {
    const semesterStats = [1, 2, 3].map(sem => {
      const subjects = semesters[sem as 1 | 2 | 3];
      const ready = subjects.filter(s => s.status === 'ready').length;
      const total = subjects.length;
      return { semester: sem, ready, total };
    });
    return semesterStats;
  }, []);

  const toggleSubject = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const togglePinned = (subjectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPinned = new Set(pinnedSubjects);
    if (newPinned.has(subjectId)) {
      newPinned.delete(subjectId);
    } else {
      newPinned.add(subjectId);
    }
    setPinnedSubjects(newPinned);
  };

  const expandAll = () => {
    const allSubjectIds = filteredSubjects.map(({ subject }) => subject.id);
    setExpandedSubjects(new Set(allSubjectIds));
  };

  const collapseAll = () => {
    setExpandedSubjects(new Set());
    setExpandedFolders(new Set());
  };

  // Подсчет файлов в предмете
  const countFiles = (files: any[]): number => {
    let count = 0;
    files.forEach(file => {
      if (file.type === 'file') {
        count++;
      } else if (file.children) {
        count += countFiles(file.children);
      }
    });
    return count;
  };

  // Горячие клавиши
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K для фокуса на поиск
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
      // Ctrl/Cmd + E для раскрыть все
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        expandAll();
      }
      // Ctrl/Cmd + Q для свернуть все
      if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault();
        collapseAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredSubjects]);

  // Закрытие всех папок при переключении семестра
  useEffect(() => {
    setExpandedSubjects(new Set());
    setExpandedFolders(new Set());
  }, [activeSemester]);

  const renderFileNode = (node: any, subjectId: string, path: string = '', depth: number = 0) => {
    const nodeId = `${subjectId}-${path}-${node.name}`;
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders.has(nodeId);

    return (
      <div key={nodeId}>
        <div
          onClick={() => {
            if (isFolder) {
              toggleFolder(nodeId);
            } else if (node.url) {
              window.open(node.url, '_blank');
            }
          }}
          className="flex items-center gap-2 py-2 px-4 hover:bg-[#1c2128] cursor-pointer transition-colors group rounded-md"
          style={{ paddingLeft: `${depth * 24 + 16}px` }}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              )}
            </>
          ) : (
            <>
              <div className="w-4 flex-shrink-0" />
              <File className="w-4 h-4 text-blue-400 flex-shrink-0" />
            </>
          )}
          <span className="text-sm text-foreground group-hover:text-purple-400 transition-colors flex-1">
            {node.name}
          </span>
          {!isFolder && (
            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          )}
        </div>
        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.map((child: any) =>
              renderFileNode(child, subjectId, `${path}/${node.name}`, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d1117] dark">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#0d1117] sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-2.5 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                SPbU SE Notes
              </h1>
              <p className="text-xs text-muted-foreground">Digital Library</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </header>

      {/* Semester Tabs */}
      <div className="border-b border-[#30363d] bg-[#161b22] sticky top-[130px] z-40 backdrop-blur-lg bg-opacity-95">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveSemester('all')}
              className={`px-4 py-3 transition-all relative whitespace-nowrap ${
                activeSemester === 'all'
                  ? 'text-purple-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Все семестры
              {activeSemester === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </button>
            {([1, 2, 3] as const).map((semester) => {
              const stat = stats.find(s => s.semester === semester);
              return (
                <button
                  key={semester}
                  onClick={() => setActiveSemester(semester)}
                  className={`px-4 py-3 transition-all relative flex items-center gap-2 whitespace-nowrap ${
                    activeSemester === semester
                      ? 'text-purple-400'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>Семестр {semester}</span>
                  <span className="text-xs opacity-60">
                    ({stat?.ready}/{stat?.total})
                  </span>
                  {activeSemester === semester && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Subject List */}
      <main className="container mx-auto px-4 pb-8 mt-6">
        {filteredSubjects.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-2">
            {filteredSubjects.map(({ semester, subject }) => {
              const isExpanded = expandedSubjects.has(subject.id);
              const isPinned = pinnedSubjects.has(subject.id);
              const fileCount = countFiles(subject.files);
              return (
                <div
                  key={subject.id}
                  className={`bg-[#161b22] border rounded-lg overflow-hidden hover:border-purple-500/50 transition-all ${
                    isPinned ? 'border-purple-500/30' : 'border-[#30363d]'
                  }`}
                >
                  <div
                    onClick={() => toggleSubject(subject.id)}
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#1c2128] transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <FolderOpen className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <Folder className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      </>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-foreground">{subject.name}</h3>
                        {isPinned && (
                          <Pin className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                        )}
                        {activeSemester === 'all' && (
                          <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded">
                            Сем. {semester}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{subject.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {fileCount} {fileCount === 1 ? 'файл' : fileCount < 5 ? 'файла' : 'файлов'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => togglePinned(subject.id, e)}
                      className="p-2 hover:bg-[#0d1117] rounded-md transition-colors flex-shrink-0 group/pin"
                      title={isPinned ? 'Открепить' : 'Закрепить'}
                    >
                      <Pin
                        className={`w-4 h-4 transition-all ${
                          isPinned
                            ? 'text-purple-400 fill-purple-400'
                            : 'text-muted-foreground group-hover/pin:text-purple-400'
                        }`}
                      />
                    </button>
                    {subject.status === 'ready' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20 flex-shrink-0">
                        Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex-shrink-0">
                        In Progress
                      </span>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[#30363d] bg-[#0d1117]/50">
                      {subject.files.map((file: any) =>
                        renderFileNode(file, subject.id)
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Ничего не найдено</p>
            <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить поисковый запрос</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>SPbU Software Engineering · Digital Library · 2026</p>
        </div>
      </footer>
    </div>
  );
}