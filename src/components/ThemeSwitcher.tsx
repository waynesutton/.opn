import { useState, useEffect } from 'react';
import { PiSunBold, PiMoonBold, PiLeafBold } from 'react-icons/pi';

type Theme = 'dark' | 'light' | 'tan';

interface ThemeSwitcherProps {
  initialTheme?: 'dark' | 'light';
}

export function ThemeSwitcher({ initialTheme = 'dark' }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update body background based on theme
    if (theme === 'light') {
      document.body.style.background = 'var(--color-neutral-950)';
      document.body.style.color = 'var(--color-neutral-50)';
    } else if (theme === 'tan') {
      document.body.style.background = '#faf8f5';
      document.body.style.color = '#1a1a1a';
    } else {
      document.body.style.background = '';
      document.body.style.color = '';
    }
  }, [theme]);

  const cycleTheme = () => {
    setTheme(current => {
      if (current === 'dark') return 'light';
      if (current === 'light') return 'tan';
      return 'dark';
    });
  };

  return (
    <button
      onClick={cycleTheme}
      className="theme-switcher"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : theme === 'light' ? 'tan' : 'dark'} theme`}
      title={`Current: ${theme} theme`}
    >
      {theme === 'dark' && <PiMoonBold size={18} />}
      {theme === 'light' && <PiSunBold size={18} />}
      {theme === 'tan' && <PiLeafBold size={18} />}
      
      <style>{`
        .theme-switcher {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          padding: 0;
          background: transparent;
          border: 1px solid var(--color-neutral-200);
          border-radius: 8px;
          cursor: pointer;
          color: var(--color-foreground-subtle);
          transition: all 0.2s ease;
        }
        
        .theme-switcher:hover {
          border-color: var(--color-foreground-subtler);
          color: var(--color-foreground);
        }
        
        [data-theme="light"] .theme-switcher {
          border-color: var(--color-neutral-light-200);
          color: var(--color-foreground-subtle-light);
        }
        
        [data-theme="light"] .theme-switcher:hover {
          color: var(--color-foreground-light);
        }
        
        [data-theme="tan"] .theme-switcher {
          border-color: #e6e4e1;
          color: #6b6b6b;
        }
        
        [data-theme="tan"] .theme-switcher:hover {
          border-color: #8b7355;
          color: #1a1a1a;
        }
      `}</style>
    </button>
  );
}
