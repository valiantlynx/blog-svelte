/**
 * Language detection based on user location and browser preferences
 */

export type SupportedLanguage =
	| 'en'
	| 'de'
	| 'es'
	| 'fr'
	| 'pt'
	| 'zh'
	| 'zh_CN'
	| 'ms'
	| 'ta'
	| 'nb'
	| 'nn'
	| 'nl'
	| 'vi';

// Mapping of countries to their primary languages
const countryToLanguageMap: Record<string, SupportedLanguage[]> = {
	// China
	CN: ['zh_CN', 'zh'],
	// Taiwan, Hong Kong
	TW: ['zh', 'en'],
	HK: ['zh', 'en'],
	// Malaysia
	MY: ['ms', 'en'],
	// Singapore
	SG: ['en', 'zh_CN'],
	// India
	IN: ['ta', 'en'],
	// Tamil Nadu India
	TN: ['ta', 'en'],
	// Germany
	DE: ['de', 'en'],
	// Germany, Austria, Switzerland (German speakers)
	AT: ['de', 'en'],
	CH: ['de', 'fr', 'en'],
	// Spain
	ES: ['es', 'en'],
	// Latin America Spanish speakers
	MX: ['es', 'en'],
	AR: ['es', 'en'],
	CO: ['es', 'en'],
	CL: ['es', 'en'],
	// France
	FR: ['fr', 'en'],
	// Belgium
	BE: ['fr', 'nl', 'en'],
	// Netherlands
	NL: ['nl', 'en'],
	// Portugal, Brazil
	PT: ['pt', 'en'],
	BR: ['pt', 'en'],
	// Norway
	NO: ['nb', 'nn', 'en'],
	// Vietnam
	VN: ['vi', 'en'],
	// Default
	US: ['en'],
	GB: ['en'],
	AU: ['en'],
	CA: ['en']
};

// Browser language to app language mapping (handle edge cases)
const browserLangToAppLang: Record<string, SupportedLanguage> = {
	en: 'en',
	de: 'de',
	es: 'es',
	fr: 'fr',
	pt: 'pt',
	'pt-BR': 'pt',
	'pt-PT': 'pt',
	zh: 'zh_CN',
	'zh-CN': 'zh_CN',
	'zh-TW': 'zh',
	'zh-HK': 'zh',
	ms: 'ms',
	ta: 'ta',
	no: 'nb',
	nb: 'nb',
	nn: 'nn',
	nl: 'nl',
	vi: 'vi'
};

/**
 * Get the user's language preference based on:
 * 1. Stored preference in localStorage
 * 2. Browser Accept-Language header
 * 3. User's geographic location (IP-based)
 * 4. Default to English
 */
export function detectUserLanguage(
	acceptLanguage?: string,
	countryCode?: string,
	storedLanguage?: SupportedLanguage
): SupportedLanguage {
	// 1. Use stored preference if available
	if (storedLanguage && isValidLanguage(storedLanguage)) {
		return storedLanguage;
	}

	// 2. Try to detect from country code (highest priority for location-based)
	if (countryCode) {
		const languages = countryToLanguageMap[countryCode.toUpperCase()];
		if (languages && languages.length > 0) {
			return languages[0];
		}
	}

	// 3. Try browser Accept-Language header
	if (acceptLanguage) {
		const browserLangs = acceptLanguage
			.split(',')
			.map((lang) => lang.split(';')[0].trim().toLowerCase());

		for (const browserLang of browserLangs) {
			// Try exact match first
			if (browserLangToAppLang[browserLang]) {
				return browserLangToAppLang[browserLang];
			}

			// Try language code only (e.g., 'zh' from 'zh-CN')
			const langCode = browserLang.split('-')[0];
			if (browserLangToAppLang[langCode]) {
				return browserLangToAppLang[langCode];
			}
		}
	}

	// 4. Default to English
	return 'en';
}

/**
 * Get all supported languages for fallback
 */
export function getLanguageFallbacks(primaryLanguage: SupportedLanguage): SupportedLanguage[] {
	const fallbacks: SupportedLanguage[] = [primaryLanguage];

	// Add language group fallbacks
	if (primaryLanguage === 'zh_CN') {
		fallbacks.push('zh');
	} else if (primaryLanguage === 'zh') {
		fallbacks.push('zh_CN');
	} else if (primaryLanguage === 'nb') {
		fallbacks.push('nn');
	} else if (primaryLanguage === 'nn') {
		fallbacks.push('nb');
	}

	// Always add English as final fallback
	if (primaryLanguage !== 'en') {
		fallbacks.push('en');
	}

	return fallbacks;
}

/**
 * Check if language code is valid
 */
export function isValidLanguage(lang: unknown): lang is SupportedLanguage {
	const validLanguages: SupportedLanguage[] = [
		'en',
		'de',
		'es',
		'fr',
		'pt',
		'zh',
		'zh_CN',
		'ms',
		'ta',
		'nb',
		'nn',
		'nl',
		'vi'
	];
	return typeof lang === 'string' && validLanguages.includes(lang as SupportedLanguage);
}

/**
 * Get human-readable language name
 */
export function getLanguageName(lang: SupportedLanguage): string {
	const names: Record<SupportedLanguage, string> = {
		en: 'English',
		de: 'Deutsch',
		es: 'Español',
		fr: 'Français',
		pt: 'Português',
		zh: '中文 (繁體)',
		zh_CN: '中文 (简体)',
		ms: 'Bahasa Melayu',
		ta: 'தமிழ்',
		nb: 'Norsk (Bokmål)',
		nn: 'Norsk (Nynorsk)',
		nl: 'Nederlands',
		vi: 'Tiếng Việt'
	};

	return names[lang] || 'English';
}
