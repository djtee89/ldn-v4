import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import logo from '@/assets/logo.png';

interface HeaderProps {
  onAboutClick: () => void;
  onBookViewingClick: () => void;
  onGuideClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAboutClick, onBookViewingClick, onGuideClick }) => {
  const [language, setLanguage] = useState('en');

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
              className="font-medium hidden md:flex"
            >
              {language === 'en' ? 'About Us' : '关于我们'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onGuideClick}
              className="hidden sm:flex"
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
              <SelectTrigger className="w-[100px] hidden lg:flex">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;