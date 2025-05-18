
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon, LogIn, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const getNavItems = () => {
    const items = [
      { name: 'Dashboard', path: '/' },
    ];

    if (isAuthenticated) {
      items.push({ name: 'Upload Resume', path: '/upload' });
      
      // Only show these links for admins
      if (isAdmin) {
        items.push({ name: 'Job Requirements', path: '/jobs' });
        items.push({ name: 'Admin', path: '/admin' });
      }
    }

    return items;
  };

  const navItems = getNavItems();

  const NavItem = ({ name, path }: { name: string; path: string }) => (
    <NavLink
      to={path}
      className={({ isActive }) => cn(
        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={() => setMobileMenuOpen(false)}
    >
      {name}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="h-8 w-8 resume-gradient-bg rounded-md mr-2"></div>
            <span className="font-bold text-xl">ResumeAI</span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <NavItem key={item.name} name={item.name} path={item.path} />
          ))}
          
          {isAuthenticated ? (
            <Button variant="outline" onClick={logout} className="ml-2">
              <Lock className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <NavLink to="/login">
              <Button variant="default" className="ml-2">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </NavLink>
          )}
        </nav>
        
        {/* Mobile Navigation Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
        </Button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-background border-b shadow-lg z-50">
          <div className="container py-4 flex flex-col space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.name} name={item.name} path={item.path} />
            ))}
            
            {isAuthenticated ? (
              <Button variant="outline" onClick={logout} className="mt-2">
                <Lock className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="mt-2 w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
