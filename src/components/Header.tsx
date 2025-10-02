import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onAboutClick: () => void;
  onGuideClick: () => void;
  onShortlistClick: () => void;
  shortlistCount: number;
  language?: string;
  onLanguageChange?: (lang: string) => void;
}
const Header: React.FC<HeaderProps> = ({
  onAboutClick,
  onGuideClick,
  onShortlistClick,
  shortlistCount,
  language = 'en',
  onLanguageChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuOpen && !(e.target as Element).closest('header')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);
  const handleNavClick = (callback: () => void) => {
    callback();
    setMobileMenuOpen(false);
  };
  return (
    <header className="bg-background border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Minimalist Logo */}
          <Link to="/" className="flex items-center group transition-opacity hover:opacity-80">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">LDN</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onAboutClick}
              className="text-sm font-medium"
            >
              About Us
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onGuideClick}
              className="text-sm font-medium"
            >
              Property Guide
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLanguageChange?.(language === 'en' ? 'cn' : 'en')}
              className="text-sm font-medium"
            >
              <Globe className="h-4 w-4 mr-1" />
              {language === 'en' ? 'EN' : '中文'}
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={e => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }} 
              className="h-8 w-8 p-0"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg py-2 px-4 space-y-1 animate-fade-in md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavClick(onShortlistClick)} 
              className="w-full justify-start text-sm"
            >
              <Heart className="h-4 w-4 mr-2" />
              Shortlist ({shortlistCount})
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavClick(onAboutClick)} 
              className="w-full justify-start text-sm"
            >
              About Us
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavClick(onGuideClick)} 
              className="w-full justify-start text-sm"
            >
              Property Guide
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onLanguageChange?.(language === 'en' ? 'cn' : 'en')} 
              className="w-full justify-start text-sm"
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === 'en' ? 'EN' : '中文'}
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};
export default Header;