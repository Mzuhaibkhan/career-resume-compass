
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you were looking for: {location.pathname}
          </p>
        </div>
        
        <div className="h-px w-full bg-border" />
        
        <div className="space-y-4">
          <p>Here are some helpful links instead:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild>
              <Link to="/">Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/upload">Upload Resume</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/jobs">Job Requirements</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
