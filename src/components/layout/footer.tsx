'use client';

import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with ❤️ for the AI community
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/yourusername/llm-chess-bench"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="/docs"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Documentation
          </a>
          <a
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
} 