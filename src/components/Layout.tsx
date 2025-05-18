
import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-6">
        {children}
      </main>
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ResumeAI Skills Extractor
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
