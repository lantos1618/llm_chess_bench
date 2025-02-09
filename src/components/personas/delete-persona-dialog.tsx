'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc/client';
import { useToast } from '@/hooks/use-toast';
import { type RouterOutputs } from '@/lib/trpc/shared';

type Persona = RouterOutputs['persona']['list'][number];

interface DeletePersonaDialogProps {
  persona: Persona;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePersonaDialog({
  persona,
  open,
  onOpenChange,
}: DeletePersonaDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useContext();

  const deletePersona = trpc.persona.delete.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Persona deleted successfully',
      });
      onOpenChange(false);
      utils.persona.list.invalidate();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const onDelete = () => {
    setIsDeleting(true);
    deletePersona.mutate({ id: persona.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Persona</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {persona.name}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 