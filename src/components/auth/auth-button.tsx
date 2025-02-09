'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Button variant="ghost" size="sm" disabled>Loading...</Button>;
  }

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            {session.user.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => signOut()}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => signIn()}>
      Sign in
    </Button>
  );
} 