import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  UserCog,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type AppRole = Database['public']['Enums']['app_role'];

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: AppRole;
}

const AVAILABLE_ROLES: AppRole[] = ['admin', 'editor', 'viewer'];

const TeamPage = () => {
  const { language } = useLanguage();
  const { canView } = usePermissions();
  const { profile, user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  const handleRoleChange = async (memberId: string, newRole: AppRole) => {
    // Prevent changing own role
    if (memberId === user?.id) {
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: language === 'he' 
          ? 'לא ניתן לשנות את התפקיד שלך'
          : 'You cannot change your own role',
        variant: 'destructive',
      });
      return;
    }

    setUpdatingRole(memberId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', memberId);

      if (error) throw error;

      // Update local state
      setTeamMembers(prev => 
        prev.map(m => m.id === memberId ? { ...m, role: newRole } : m)
      );

      toast({
        title: language === 'he' ? 'התפקיד עודכן' : 'Role Updated',
        description: language === 'he'
          ? 'התפקיד עודכן בהצלחה'
          : 'Team member role has been updated',
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: language === 'he'
          ? 'לא ניתן לעדכן את התפקיד'
          : 'Failed to update role',
        variant: 'destructive',
      });
    } finally {
      setUpdatingRole(null);
    }
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!profile?.organization_id) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch profiles in the same organization
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email')
          .eq('organization_id', profile.organization_id);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setIsLoading(false);
          return;
        }

        // Fetch roles for all team members
        const userIds = profiles.map(p => p.id);
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);

        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
        }

        // Combine profiles with roles
        const members: TeamMember[] = profiles.map(p => {
          const userRole = roles?.find(r => r.user_id === p.id);
          return {
            id: p.id,
            name: p.name,
            email: p.email,
            role: userRole?.role || 'viewer',
          };
        });

        setTeamMembers(members);
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [profile?.organization_id]);

  // Check permission - show access denied if not allowed
  if (!canView('team')) {
    return <AccessDenied />;
  }

  const getInitials = (name: string | null) => {
    if (!name) return '?';
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
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))
            ) : teamMembers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {language === 'he' ? 'לא נמצאו חברי צוות' : 'No team members found'}
              </p>
            ) : (
              teamMembers.map(member => (
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
                      <p className="font-medium">{member.name || member.email}</p>
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
                          {AVAILABLE_ROLES.map(role => (
                            <DropdownMenuItem
                              key={role}
                              disabled={member.role === role || member.id === user?.id || updatingRole === member.id}
                              onClick={() => handleRoleChange(member.id, role)}
                            >
                              <UserCog className="w-4 h-4 me-2" />
                              {language === 'he' ? 'שנה ל' : 'Set as '}{getRoleLabel(role, language)}
                              {member.role === role && (
                                <Badge variant="outline" className="ms-2 text-xs">
                                  {language === 'he' ? 'נוכחי' : 'Current'}
                                </Badge>
                              )}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuItem className="text-destructive" disabled={member.id === user?.id}>
                            <Trash2 className="w-4 h-4 me-2" />
                            {language === 'he' ? 'הסר מהצוות' : 'Remove from Team'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CanEdit>
                  </div>
                </div>
              ))
            )}
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
