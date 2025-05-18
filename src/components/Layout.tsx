
import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-6">
        {user && (
          <div className="mb-6">
            <h2 className="text-xl font-medium">
              Welcome, {user.name || user.email}
              {user.role === 'admin' && (
                <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 text-primary text-xs px-2 py-1">
                  Admin
                </span>
              )}
            </h2>
          </div>
        )}
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
