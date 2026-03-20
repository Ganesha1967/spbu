import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        placeholder="Поиск по предметам..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#161b22] border border-[#30363d] rounded-lg py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
      />
    </div>
  );
}
