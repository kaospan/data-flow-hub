import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getRoleLabel } from '@/hooks/usePermissions';
import { AdminOnly, CanEdit } from '@/components/auth/RoleGuard';
import { AccessDenied } from '@/components/auth/AccessDenied';
import {
  Users,
  Mail,
  Shield,
  MoreVertical,
  UserPlus,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock team data - in production this would come from the database
const teamMembers = [
  { id: '1', name: 'Israel Israeli', email: 'israel@example.com', role: 'admin' as const },
  { id: '2', name: 'David Cohen', email: 'david@example.com', role: 'editor' as const },
  { id: '3', name: 'Sarah Levi', email: 'sarah@example.com', role: 'viewer' as const },
];

const TeamPage = () => {
  const { language } = useLanguage();
  const { canView } = usePermissions();

  // Check permission - show access denied if not allowed
  if (!canView('team')) {
    return <AccessDenied />;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'editor': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {language === 'he' ? 'ניהול צוות' : 'Team Management'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'he' 
              ? 'נהל את חברי הצוות וההרשאות שלהם'
              : 'Manage your team members and their permissions'
            }
          </p>
        </div>
        <AdminOnly>
          <Button>
            <UserPlus className="w-4 h-4 me-2" />
            {language === 'he' ? 'הזמן חבר צוות' : 'Invite Member'}
          </Button>
        </AdminOnly>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {language === 'he' ? 'חברי צוות' : 'Team Members'}
          </CardTitle>
          <CardDescription>
            {language === 'he' 
              ? `${teamMembers.length} חברים בארגון`
              : `${teamMembers.length} members in organization`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map(member => (
              <div 
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(member.role)} className="gap-1">
                    <Shield className="w-3 h-3" />
                    {getRoleLabel(member.role, language)}
                  </Badge>
                  <CanEdit resource="team">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          {language === 'he' ? 'שנה תפקיד' : 'Change Role'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 me-2" />
                          {language === 'he' ? 'הסר מהצוות' : 'Remove from Team'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CanEdit>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'he' ? 'הרשאות לפי תפקיד' : 'Role Permissions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30">
              <Badge variant="default" className="mb-2">{getRoleLabel('admin', language)}</Badge>
              <p className="text-sm text-muted-foreground">
                {language === 'he' 
                  ? 'גישה מלאה לכל התכונות, ניהול צוות וחיוב'
                  : 'Full access to all features, team and billing management'
                }
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <Badge variant="secondary" className="mb-2">{getRoleLabel('editor', language)}</Badge>
              <p className="text-sm text-muted-foreground">
                {language === 'he' 
                  ? 'יכולת ליצור ולערוך מקורות נתונים ואוטומציות'
                  : 'Can create and edit data sources and automations'
                }
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <Badge variant="outline" className="mb-2">{getRoleLabel('viewer', language)}</Badge>
              <p className="text-sm text-muted-foreground">
                {language === 'he' 
                  ? 'צפייה בלבד בנתונים ובלוח הבקרה'
                  : 'View-only access to data and dashboard'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamPage;
