
"use client";

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { type SuggestFramesBasedOnPreferenceOutput } from '@/ai/flows/suggest-frames-based-preference';

const CASES_KEY = 'visionary-cases';

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
  analysis?: SuggestFramesBasedOnPreferenceOutput;
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
    const updatedCases = [...cases, caseWithId];
    saveCases(updatedCases);
    return caseWithId.id;
  }, [cases]);

  const updateCase = useCallback((caseId: string, updatedData: Partial<PatientCase>) => {
    const updatedCases = cases.map(c => c.id === caseId ? { ...c, ...updatedData } : c);
    saveCases(updatedCases);
  }, [cases]);

  const removeCase = useCallback((caseId: string) => {
    const updatedCases = cases.filter((c) => c.id !== caseId);
    saveCases(updatedCases);
  }, [cases]);

  const getCase = useCallback((caseId: string) => {
    return cases.find(c => c.id === caseId);
  }, [cases]);

  return { cases, addCase, updateCase, removeCase, getCase, isInitialized };
};
