import React, { useState } from 'react';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import styles from '../styles/TopBar.module.css';

interface TopBarProps {
  onExport?: () => void;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pl', label: 'Polski' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
];

export const TopBar: React.FC<TopBarProps> = ({ onExport }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  return (
    <header className={styles.topBar}>
      <div className={styles.container}>
        <div className={styles.branding}>
          <h1 className={styles.title}>{t('app.title')}</h1>
          <p className={styles.subtitle}>{t('app.subtitle')}</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.languageSelector}>
            <button
              className={styles.languageButton}
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              aria-label={t('topbar.language')}
            >
              <span className={styles.languageLabel}>{t('topbar.language')}</span>
              <span className={styles.languageCode}>{language.toUpperCase()}</span>
            </button>

            {isLanguageDropdownOpen && (
              <div className={styles.languageDropdown}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`${styles.languageOption} ${
                      language === lang.code ? styles.active : ''
                    }`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLanguageDropdownOpen(false);
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {onExport && (
            <button className={styles.exportButton} onClick={onExport}>
              {t('topbar.export')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
