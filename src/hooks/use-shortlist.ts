import { useState, useEffect } from 'react';
import { Development } from '@/data/newDevelopments';

const SHORTLIST_KEY = 'ldn-shortlist';

export const useShortlist = () => {
  const [shortlist, setShortlist] = useState<Development[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SHORTLIST_KEY);
    if (stored) {
      try {
        setShortlist(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse shortlist', e);
      }
    }
  }, []);

  // Save to localStorage whenever shortlist changes
  useEffect(() => {
    localStorage.setItem(SHORTLIST_KEY, JSON.stringify(shortlist));
  }, [shortlist]);

  const addToShortlist = (development: Development) => {
    setShortlist(prev => {
      if (prev.some(d => d.name === development.name)) {
        return prev;
      }
      return [...prev, development];
    });
  };

  const removeFromShortlist = (developmentName: string) => {
    setShortlist(prev => prev.filter(d => d.name !== developmentName));
  };

  const isInShortlist = (developmentName: string) => {
    return shortlist.some(d => d.name === developmentName);
  };

  const toggleShortlist = (development: Development) => {
    if (isInShortlist(development.name)) {
      removeFromShortlist(development.name);
      return false;
    } else {
      addToShortlist(development);
      return true;
    }
  };

  return {
    shortlist,
    addToShortlist,
    removeFromShortlist,
    isInShortlist,
    toggleShortlist,
  };
};
