import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { getRoleLabel } from '@/hooks/usePermissions';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search, Menu, X, Building2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export function DashboardHeader({ onMenuToggle, isMenuOpen }: DashboardHeaderProps) {
  const { t, language } = useLanguage();
  const { profile, organization, role, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const getInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (profile?.email) {
      return profile.email.slice(0, 2).toUpperCase();
    }
    return '??';
  };

  const getDisplayName = () => {
    if (profile?.name) return profile.name;
    if (profile?.email) return profile.email.split('@')[0];
    return language === 'he' ? 'משתמש' : 'User';
  };

  const getRoleBadgeVariant = () => {
    switch (role) {
      case 'admin': return 'default';
      case 'editor': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="h-16 bg-card/50 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 hover:bg-accent rounded-lg"
        onClick={onMenuToggle}
      >
        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={language === 'he' ? 'חיפוש...' : 'Search...'}
            className="ps-10 bg-secondary/50 border-border/50"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Organization indicator */}
        {organization && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 me-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{organization.name}</span>
          </div>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 end-1 w-2 h-2 bg-primary rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              {isLoading ? (
                <>
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="hidden md:block w-24 h-4" />
                </>
              ) : (
                <>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{getDisplayName()}</span>
                    {role && (
                      <Badge variant={getRoleBadgeVariant()} className="text-xs h-5">
                        {getRoleLabel(role, language)}
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{getDisplayName()}</p>
                <p className="text-xs text-muted-foreground">{profile?.email}</p>
                {role && (
                  <Badge variant={getRoleBadgeVariant()} className="w-fit text-xs mt-1">
                    {getRoleLabel(role, language)}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
              {t('settings.profile')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
              {t('settings.workspace')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
              {t('settings.billing')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              {t('nav.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
