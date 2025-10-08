
"use client";

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { type SelectFramesFromCatalogOutput } from '@/ai/flows/select-frames-from-catalog';

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
  image?: string;
  faceShape?: string;
  skinTone?: string;
  analysis?: SelectFramesFromCatalogOutput;
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

  const saveCases = (newCases: PatientCase[]) => {
    try {
      setCases(newCases);
      window.localStorage.setItem(CASES_KEY, JSON.stringify(newCases));
    } catch (error) {
      console.error('Failed to save cases to localStorage', error);
    }
  };

  const addCase = useCallback((newCaseData: Omit<PatientCase, 'id'>) => {
    const caseWithId: PatientCase = { ...newCaseData, id: `CASE-${uuidv4().slice(0,4).toUpperCase()}` };
    
    // Create a version of the case for storage that omits the large image data
    const { image, ...caseToStore } = caseWithId;
    
    setCases(prevCases => {
        const updatedCases = [...prevCases, caseToStore as PatientCase];
        try {
            window.localStorage.setItem(CASES_KEY, JSON.stringify(updatedCases));
        } catch (error) {
            console.error('Failed to save cases to localStorage', error);
        }
        return updatedCases;
    });
    return caseWithId; // Return the full case object including image for immediate use
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
    const updatedCases = cases.filter((c) => c.id !== caseId);
    saveCases(updatedCases);
  }, [cases]);

  const getCase = useCallback((caseId: string) => {
    return cases.find(c => c.id === caseId);
  }, [cases]);

  return { cases, addCase, updateCase, removeCase, getCase, isInitialized };
};

    