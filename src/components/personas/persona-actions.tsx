'use client';

import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditPersonaDialog } from './edit-persona-dialog';
import { DeletePersonaDialog } from './delete-persona-dialog';
import { type RouterOutputs } from '@/lib/trpc/shared';

type Persona = RouterOutputs['persona']['list'][number];

interface PersonaActionsProps {
  persona: Persona;
}

export function PersonaActions({ persona }: PersonaActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditPersonaDialog
        persona={persona}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeletePersonaDialog
        persona={persona}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
} 