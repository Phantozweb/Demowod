"use client";

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'visionary-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(FAVORITES_KEY);
      if (item) {
        setFavorites(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
      setFavorites([]);
    }
    setIsInitialized(true);
  }, []);

  const saveFavorites = (newFavorites: string[]) => {
    try {
      setFavorites(newFavorites);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.log(error);
    }
  };

  const addFavorite = useCallback((frameId: string) => {
    saveFavorites([...favorites, frameId]);
  }, [favorites]);

  const removeFavorite = useCallback((frameId: string) => {
    saveFavorites(favorites.filter((id) => id !== frameId));
  }, [favorites]);

  const isFavorite = useCallback((frameId: string) => {
    return favorites.includes(frameId);
  }, [favorites]);

  const toggleFavorite = useCallback((frameId: string) => {
    if (isFavorite(frameId)) {
      removeFavorite(frameId);
    } else {
      addFavorite(frameId);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return { favorites, toggleFavorite, isFavorite, count: favorites.length, isInitialized };
};
