import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, Heart } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import logo from '@/assets/logo.png';
import { translations } from '@/i18n/translations';

interface HeaderProps {
  onAboutClick: () => void;
  onBookViewingClick: () => void;
  onGuideClick: () => void;
  onShortlistClick: () => void;
  shortlistCount: number;
}
const Header: React.FC<HeaderProps> = ({
  onAboutClick,
  onBookViewingClick,
  onGuideClick,
  onShortlistClick,
  shortlistCount,
}) => {
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
  return <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-1.5 relative">
        <div className="flex items-center justify-between">
          {/* Logo and Tagline */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <img src={logo} alt="LDN Logo" className="h-7 w-7" />
              <div>
                <h1 className="text-sm font-semibold text-foreground tracking-tight">LDN</h1>
                <p className="text-[9px] text-muted-foreground hidden sm:block leading-tight">London Development Network</p>
              </div>
            </div>
            <div className="hidden md:block h-4 w-px bg-border/60 mx-1" />
            <p className="hidden md:block text-xs text-foreground tracking-tight">
              London's New Builds All Under One Roof
            </p>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onShortlistClick}
              className="relative text-xs h-7 px-2.5 rounded-full font-medium tracking-tight text-foreground border-border hover:bg-muted transition-all"
            >
              <Heart className="h-3 w-3 mr-1" />
              {translations[language as 'en' | 'zh'].shortlist.button} ({shortlistCount})
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAboutClick} 
              className="text-xs h-7 px-2.5 rounded-full font-medium tracking-tight text-foreground border-border hover:bg-muted transition-all"
            >
              {language === 'en' ? 'About Us' : '关于我们'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGuideClick} 
              className="text-xs h-7 px-2.5 rounded-full font-medium tracking-tight text-foreground border-border hover:bg-muted transition-all"
            >
              {language === 'en' ? 'Property Guide' : '购房指南'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBookViewingClick} 
              className="text-xs h-7 px-2.5 rounded-full font-medium tracking-tight text-foreground border-border hover:bg-muted transition-all"
            >
              {language === 'en' ? 'Speak to an Expert' : '联系专家'}
            </Button>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[75px] h-7 text-xs rounded-full font-medium text-foreground border-border">
                <Globe className="h-3 w-3 mr-0.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-1">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[50px] h-7 text-[10px] rounded-full">
                <Globe className="h-3 w-3 mr-0.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={e => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }} 
              className="mobile-nav-toggle touch-target h-7 w-7 rounded-full"
            >
              {mobileMenuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg py-2 px-4 space-y-1 animate-fade-in md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavClick(onShortlistClick)} 
              className="w-full justify-start text-xs h-8 rounded-full text-foreground hover:bg-muted"
            >
              <Heart className="h-3 w-3 mr-2" />
              {translations[language as 'en' | 'zh'].shortlist.button} ({shortlistCount})
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavClick(onAboutClick)} 
              className="w-full justify-start text-xs h-8 rounded-full text-foreground hover:bg-muted"
            >
              {language === 'en' ? 'About Us' : '关于我们'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavClick(onGuideClick)} 
              className="w-full justify-start text-xs h-8 rounded-full text-foreground hover:bg-muted"
            >
              {language === 'en' ? 'Property Guide' : '购房指南'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavClick(onBookViewingClick)} 
              className="w-full justify-start text-xs h-8 rounded-full text-foreground hover:bg-muted"
            >
              {language === 'en' ? 'Speak to an Expert' : '联系专家'}
            </Button>
          </nav>
        )}
      </div>
    </header>;
};
export default Header;