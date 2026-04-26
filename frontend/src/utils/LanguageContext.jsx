import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', rtl: false },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', rtl: false },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', rtl: false },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', rtl: false },
  { code: 'mr', name: 'Marathi', native: 'मराठी', rtl: false },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', rtl: false },
  { code: 'ur', name: 'Urdu', native: 'اردو', rtl: true },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', rtl: false },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', rtl: false },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', rtl: false },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', rtl: false },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', rtl: false },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', rtl: false },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', rtl: false },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', rtl: false },
  { code: 'ks', name: 'Kashmiri', native: 'कश्मीरी', rtl: false },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', rtl: false },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', rtl: true },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', rtl: false },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্', rtl: false },
  { code: 'brx', name: 'Bodo', native: 'बड़ो', rtl: false },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी', rtl: false },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', rtl: false },
];

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const t = (key) => translations[lang]?.[key] || translations['en'][key] || key;
  const currentLang = LANGUAGES.find(l => l.code === lang);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t, currentLang, LANGUAGES }}>
      <div dir={currentLang?.rtl ? 'rtl' : 'ltr'}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
