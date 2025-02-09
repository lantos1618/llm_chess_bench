'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/arena',
    label: 'Arena',
  },
  {
    href: '/personas',
    label: 'Personas',
  },
  {
    href: '/analytics',
    label: 'Analytics',
  },
  {
    href: '/community',
    label: 'Community',
  },
] as const;

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === item.href ? "text-foreground" : "text-foreground/60"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
} 