import React from 'react';
import { Sparkles, MapPin, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-stone-200/80 dark:border-stone-800/80 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md py-4 px-4 pb-20 sm:pb-4 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400">
        {/* App Title & Dynamic Year */}
        <div className="flex items-center gap-2 font-medium flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200 font-bold">
            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>ബൈബിൾ സ്ഥലങ്ങൾ (Bible Places Explorer)</span>
          </div>
          <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
          <span className="text-stone-500 dark:text-stone-400">
            © {currentYear} All Rights Reserved
          </span>
        </div>

        {/* Developer Attribution with AI badge */}
        <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
          <span>Developed by</span>
          <span className="font-bold text-amber-700 dark:text-amber-400">
            JoelStan
          </span>
          <span>using AI</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>
      </div>
    </footer>
  );
};
