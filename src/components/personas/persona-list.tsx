'use client';

import { trpc } from '@/lib/trpc/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PersonaActions } from './persona-actions';

export function PersonaList() {
  const { data: personas, isLoading } = trpc.persona.list.useQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 w-1/2 bg-muted rounded" />
              <div className="h-3 w-1/3 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-2/3 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!personas?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No personas found</CardTitle>
          <CardDescription>
            Create your first persona to get started
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {personas.map((persona) => (
        <Card key={persona.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>{persona.name}</CardTitle>
              <CardDescription>{persona.model}</CardDescription>
            </div>
            <PersonaActions persona={persona} />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ELO Rating</span>
                <span className="text-sm text-muted-foreground">
                  {persona.elo}
                </span>
              </div>
              {persona.ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium capitalize">
                    {rating.format}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {rating.elo}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 