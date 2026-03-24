import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const NAV_ITEMS = [
  { label: 'Главная', path: '/', icon: 'Home' },
  { label: 'Игры', path: '/games', icon: 'Gamepad2' },
  { label: 'Теория', path: '/theory', icon: 'BookOpen' },
  { label: 'Результаты', path: '/results', icon: 'BarChart3' },
  { label: 'Профиль', path: '/profile', icon: 'User' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0d0e1a]/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-lg shadow-lg shadow-purple-500/30">
              🚀
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-white text-sm leading-tight">ОГЭ Тренажёр</div>
              <div className="text-[10px] text-white/40 leading-tight">Информатика</div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0d0e1a]/95 px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                className={`nav-item w-full text-left ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-white/30 text-xs">
        ОГЭ Тренажёр по информатике · 12 заданий · Готовься с удовольствием 🚀
      </footer>
    </div>
  );
}
