export interface SupportedLanguage {
  code: string;
  flag: string;
  name: string;
  nativeName?: string;
}

export const DOCS_LANGUAGE_STORAGE_KEY = 'docs_language';
export const DOCS_LANGUAGE_COOKIE_KEY = 'docs_language';

export const DEFAULT_LANGUAGE_CODE = 'en';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'ar', flag: '🇸🇦', name: 'Arabic', nativeName: 'العربية' },
  { code: 'bg', flag: '🇧🇬', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'zh', flag: '🇨🇳', name: 'Chinese (Simplified)', nativeName: '中文（简体）' },
  { code: 'hr', flag: '🇭🇷', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'cs', flag: '🇨🇿', name: 'Czech', nativeName: 'Čeština' },
  { code: 'da', flag: '🇩🇰', name: 'Danish', nativeName: 'Dansk' },
  { code: 'nl', flag: '🇳🇱', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'en', flag: '🇺🇸', name: 'English', nativeName: 'English' },
  { code: 'et', flag: '🇪🇪', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'fi', flag: '🇫🇮', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'fr', flag: '🇫🇷', name: 'French', nativeName: 'Français' },
  { code: 'de', flag: '🇩🇪', name: 'German', nativeName: 'Deutsch' },
  { code: 'el', flag: '🇬🇷', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'he', flag: '🇮🇱', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'hi', flag: '🇮🇳', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'hu', flag: '🇭🇺', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'id', flag: '🇮🇩', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'it', flag: '🇮🇹', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ja', flag: '🇯🇵', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', flag: '🇰🇷', name: 'Korean', nativeName: '한국어' },
  { code: 'lv', flag: '🇱🇻', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'lt', flag: '🇱🇹', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'no', flag: '🇳🇴', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'pl', flag: '🇵🇱', name: 'Polish', nativeName: 'Polski' },
  { code: 'pt', flag: '🇧🇷', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ro', flag: '🇷🇴', name: 'Romanian', nativeName: 'Română' },
  { code: 'ru', flag: '🇷🇺', name: 'Russian', nativeName: 'Русский' },
  { code: 'sk', flag: '🇸🇰', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'sl', flag: '🇸🇮', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'es', flag: '🇪🇸', name: 'Spanish', nativeName: 'Español' },
  { code: 'sv', flag: '🇸🇪', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'th', flag: '🇹🇭', name: 'Thai', nativeName: 'ไทย' },
  { code: 'tr', flag: '🇹🇷', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'uk', flag: '🇺🇦', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'vi', flag: '🇻🇳', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
];

export function isSupportedLanguageCode(
  value: string | null | undefined
): value is SupportedLanguage['code'] {
  return SUPPORTED_LANGUAGES.some((language) => language.code === value);
}

export function getLanguageByCode(code: string): SupportedLanguage | undefined {
  return SUPPORTED_LANGUAGES.find((language) => language.code === code);
}
