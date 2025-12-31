import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Zap,
  LayoutDashboard,
  Database,
  Workflow,
  Settings,
  HelpCircle,
  LogOut,
  Globe,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { icon: LayoutDashboard, labelKey: 'dashboard.title', path: '/dashboard' },
  { icon: Database, labelKey: 'sources.title', path: '/dashboard/sources' },
  { icon: Workflow, labelKey: 'automations.title', path: '/dashboard/automations' },
  { icon: Settings, labelKey: 'settings.title', path: '/dashboard/settings' },
];

interface DashboardSidebarProps {
  onClose?: () => void;
}

export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="h-screen w-64 bg-sidebar border-e border-sidebar-border flex flex-col">
      {/* Logo + Close button */}
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2" onClick={handleNavClick}>
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text">DataFlow</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{t(item.labelKey)}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
              <Globe className="w-5 h-5" />
              <span className="font-medium">{language === 'he' ? 'עברית' : 'English'}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setLanguage('he')}>עברית</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          to="/help"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">{language === 'he' ? 'עזרה' : 'Help'}</span>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t('nav.logout')}</span>
        </Link>
      </div>
    </aside>
  );
}
