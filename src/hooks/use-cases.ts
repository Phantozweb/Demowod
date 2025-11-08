
"use client";

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { type SuggestInitialFramesOutput } from '@/lib/types';

const CASES_KEY = 'focus-casex-cases';

export type PatientCase = {
  id: string;
  date: string;
  status: 'Pending' | 'Completed';
  patientName: string;
  age?: number;
  gender?: string;
  contactInfo?: string;
  occupation?: string;
  lifestyle?: string;
  visualNeeds?: string;
  stylePreferences?: string;
  pastPurchases?: string;
  distSphOd?: string;
  distSphOs?: string;
  distCyl?: string;
  distAxis?: string;
  nearAddOd?: string;
  nearAddOs?: string;
  pdDist?: string;
  pdNear?: string;
  faceShape?: string;
  skinTone?: string;
  analysis?: SuggestInitialFramesOutput;
  patientImage?: string | null;
};

export const useCases = () => {
  const [cases, setCases] = useState<PatientCase[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(CASES_KEY);
      if (item) {
        setCases(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to load cases from localStorage', error);
      setCases([]);
    }
    setIsInitialized(true);
  }, []);

  const addCase = useCallback((newCaseData: Omit<PatientCase, 'id'>) => {
    const caseWithId: PatientCase = { ...newCaseData, id: `CASE-${uuidv4().slice(0,4).toUpperCase()}` };
    
    setCases(prevCases => {
        const updatedCases = [...prevCases, caseWithId];
        try {
            window.localStorage.setItem(CASES_KEY, JSON.stringify(updatedCases));
        } catch (error) {
            console.error('Failed to save cases to localStorage', error);
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
              alert('Could not save case. Local storage is full. Please clear some old cases.');
            }
        }
        return updatedCases;
    });
    return caseWithId;
  }, []);

  const updateCase = useCallback((caseId: string, updatedData: Partial<PatientCase>) => {
    setCases(prevCases => {
      const updatedCases = prevCases.map(c => c.id === caseId ? { ...c, ...updatedData } : c);
      try {
        window.localStorage.setItem(CASES_KEY, JSON.stringify(updatedCases));
      } catch (error) {
        console.error('Failed to save updated case to localStorage', error);
      }
      return updatedCases;
    });
  }, []);

  const removeCase = useCallback((caseId: string) => {
    setCases(prevCases => {
      const updatedCases = prevCases.filter((c) => c.id !== caseId);
      try {
        window.localStorage.setItem(CASES_KEY, JSON.stringify(updatedCases));
      } catch (error) {
        console.error('Failed to remove case from localStorage', error);
      }
      return updatedCases;
    });
  }, []);

  const getCase = useCallback((caseId: string) => {
    const item = window.localStorage.getItem(CASES_KEY);
    if (item) {
      const allCases: PatientCase[] = JSON.parse(item);
      return allCases.find(c => c.id === caseId);
    }
    return undefined;
  }, []);

  return { cases, addCase, updateCase, removeCase, getCase, isInitialized };
};
