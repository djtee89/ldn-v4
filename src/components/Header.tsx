import React from 'react';
import { Button } from '@/components/ui/button';
import { Building2, MapPin } from 'lucide-react';
import logo from '@/assets/logo.png';

interface HeaderProps {
  onAboutClick: () => void;
  onBookViewingClick: () => void;
  onGuideClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAboutClick, onBookViewingClick, onGuideClick }) => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={logo} alt="LDN Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-foreground">LDN</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">London Development Network</p>
              </div>
            </div>
            <div className="hidden md:block h-6 w-px bg-border mx-2" />
            <p className="hidden md:block text-sm text-muted-foreground">
              London's New Builds All Under One Roof
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onAboutClick}
              className="font-medium"
            >
              About Us
            </Button>
            <Button 
              variant="outline" 
              onClick={onGuideClick}
              className="hidden sm:flex"
            >
              Property Guide
            </Button>
            <Button 
              variant="premium" 
              size="sm"
              onClick={onBookViewingClick}
            >
              Book Viewing
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;