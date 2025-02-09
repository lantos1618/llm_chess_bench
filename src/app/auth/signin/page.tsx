'use client';

import { signIn } from 'next-auth/react';
import { Github } from 'lucide-react';

export default function SignIn() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <button
          onClick={() => signIn('github', { callbackUrl: '/' })}
          className="inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Github className="h-4 w-4" />
          Continue with GitHub
        </button>
      </div>
    </div>
  );
} 