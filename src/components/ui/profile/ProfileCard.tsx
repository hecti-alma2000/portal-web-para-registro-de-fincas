import { User } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '../card';
import { Badge } from '../badge';

interface ProfileCardProps {
  user: User & {
    role?: string;
  };
}

export function ProfileCard({ user }: ProfileCardProps) {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.image || ''} alt={user.name || ''} />
          <AvatarFallback className="text-lg">{getInitials(user.name || '')}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
              {user.role === 'admin' ? 'Administrador' : 'Usuario'}
            </Badge>
          </div>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <h3 className="font-semibold">Detalles de la cuenta</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Fecha de registro</p>
              <p className="font-medium">
                {new Date().toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-medium">Activo</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
