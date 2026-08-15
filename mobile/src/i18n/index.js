import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import hi from './hi.json';
import kn from './kn.json';

const translations = { en, hi, kn };
const LANGUAGE_STORAGE_KEY = '@tourist_safe_language';

// Global state
let currentLanguage = 'en';
const listeners = new Set();

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
];

export function getLanguage() {
  return currentLanguage;
}

export async function setLanguage(lang) {
  if (!translations[lang]) {
    lang = 'en';
  }
  currentLanguage = lang;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } else if (AsyncStorage) {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  } catch (e) {
    console.warn('Failed to persist language preference', e);
  }
  listeners.forEach(fn => fn(lang));
}

// Translation helper with key path lookup e.g. "risk.highRiskArea"
export function t(path, fallback = '') {
  if (!path) return fallback;
  const keys = path.split('.');
  let current = translations[currentLanguage] || translations.en;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // Fallback to English
      let enCurrent = translations.en;
      for (const ek of keys) {
        if (enCurrent && typeof enCurrent === 'object' && ek in enCurrent) {
          enCurrent = enCurrent[ek];
        } else {
          return fallback || path;
        }
      }
      return enCurrent || fallback || path;
    }
  }
  return typeof current === 'string' ? current : fallback || path;
}

// React Context & Hook
const I18nContext = createContext({
  language: 'en',
  setLanguage,
  t
});

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(currentLanguage);

  useEffect(() => {
    // Load persisted language
    const loadStoredLang = async () => {
      try {
        let stored = null;
        if (typeof localStorage !== 'undefined') {
          stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        } else if (AsyncStorage) {
          stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        }
        if (stored && translations[stored]) {
          currentLanguage = stored;
          setLang(stored);
        }
      } catch (e) {
        // fallback
      }
    };
    loadStoredLang();

    const listener = (newLang) => setLang(newLang);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  return (
    <I18nContext.Provider value={{ language: lang, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  return {
    t: ctx.t || t,
    language: ctx.language || currentLanguage,
    setLanguage: ctx.setLanguage || setLanguage,
    languages: SUPPORTED_LANGUAGES
  };
}

export default {
  t,
  setLanguage,
  getLanguage,
  SUPPORTED_LANGUAGES,
  useTranslation,
  I18nProvider
};
