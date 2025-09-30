import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import logo from '@/assets/logo.png';

interface HeaderProps {
  onAboutClick: () => void;
  onBookViewingClick: () => void;
  onGuideClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAboutClick, onBookViewingClick, onGuideClick }) => {
  const [language, setLanguage] = useState('en');
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
    <header className="bg-background border-b border-border sticky top-0 z-40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 relative">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onAboutClick}
              className="font-medium"
            >
              {language === 'en' ? 'About Us' : '关于我们'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onGuideClick}
            >
              {language === 'en' ? 'Property Guide' : '购房指南'}
            </Button>
            <Button 
              variant="premium" 
              size="sm"
              onClick={onBookViewingClick}
            >
              {language === 'en' ? 'Speak to an Expert' : '联系专家'}
            </Button>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[100px]">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </nav>

          {/* Mobile Menu Toggle & Primary CTA */}
          <div className="flex md:hidden items-center gap-2">
            <Button 
              variant="premium" 
              size="sm"
              onClick={onBookViewingClick}
            >
              {language === 'en' ? 'Expert' : '专家'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <nav className={`nav-links ${mobileMenuOpen ? 'show' : ''}`}>
          <Button 
            variant="ghost" 
            onClick={() => handleNavClick(onAboutClick)}
            className="font-medium w-full justify-start"
          >
            {language === 'en' ? 'About Us' : '关于我们'}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleNavClick(onGuideClick)}
            className="w-full justify-start"
          >
            {language === 'en' ? 'Property Guide' : '购房指南'}
          </Button>
          <div className="flex items-center gap-2 px-3 py-2">
            <Globe className="h-4 w-4" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full border-0 shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;