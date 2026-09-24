import React from 'react';
import { Compass, List, Route, BookOpen, Clock } from 'lucide-react';
import { NavTab } from './Navbar';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
}) => {
  const tabs: { id: NavTab; labelEn: string; labelMl: string; icon: React.ReactNode }[] = [
    {
      id: 'map',
      labelEn: 'Map',
      labelMl: 'മാപ്പ്',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'places',
      labelEn: 'Places',
      labelMl: 'സ്ഥലങ്ങൾ',
      icon: <List className="w-5 h-5" />,
    },
    {
      id: 'paul',
      labelEn: 'Paul',
      labelMl: 'പൗലോസ്',
      icon: <Route className="w-5 h-5" />,
    },
    {
      id: 'jesus',
      labelEn: 'Jesus',
      labelMl: 'യേശു',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'timeline',
      labelEn: 'Timeline',
      labelMl: 'സമയരേഖ',
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-t border-amber-200/80 dark:border-stone-800 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-colors"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto items-center">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 select-none cursor-pointer active:scale-90 ${
                isActive
                  ? 'bg-amber-500/15 dark:bg-amber-400/15 text-amber-700 dark:text-amber-300 font-bold shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <div className="relative">
                <span className={isActive ? 'text-amber-600 dark:text-amber-400 [&>svg]:stroke-[2.5]' : ''}>
                  {tab.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] mt-0.5 leading-tight tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
