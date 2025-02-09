'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PersonaList } from '@/components/personas/persona-list';
import { CreatePersonaDialog } from '@/components/personas/create-persona-dialog';

export default function PersonasPage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personas</h1>
          <p className="text-muted-foreground">
            Manage your AI personas and track their performance
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Persona
        </Button>
      </div>

      <PersonaList />
      <CreatePersonaDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
} 