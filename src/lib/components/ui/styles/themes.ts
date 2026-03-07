// Available themes (color schemes without mode variant)
export const themeNames = [
	{
		id: 'default',
		label: 'Default',
		description: 'Neutral blues and grays'
	},
	{
		id: 'ocean',
		label: 'Ocean',
		description: 'Blues and teals'
	},
	{
		id: 'forest',
		label: 'Forest',
		description: 'Greens and earth tones'
	},
	{
		id: 'sunset',
		label: 'Sunset',
		description: 'Warm oranges and reds'
	},
	{
		id: 'lavender',
		label: 'Lavender',
		description: 'Purples and pinks'
	}
];

// For backwards compatibility with legacy dropdown
export const themes = [
	{
		id: 'default-light',
		name: 'default',
		label: 'Default',
		displayLabel: 'Default',
		mode: 'light',
		description: 'Neutral blues and grays'
	},
	{
		id: 'default-dark',
		name: 'default',
		label: 'Default Dark',
		displayLabel: 'Default Dark',
		mode: 'dark',
		description: 'Neutral blues and grays'
	},
	{
		id: 'ocean-light',
		name: 'ocean',
		label: 'Ocean',
		displayLabel: 'Ocean',
		mode: 'light',
		description: 'Blues and teals'
	},
	{
		id: 'ocean-dark',
		name: 'ocean',
		label: 'Ocean Dark',
		displayLabel: 'Ocean Dark',
		mode: 'dark',
		description: 'Blues and teals'
	},
	{
		id: 'forest-light',
		name: 'forest',
		label: 'Forest',
		displayLabel: 'Forest',
		mode: 'light',
		description: 'Greens and earth tones'
	},
	{
		id: 'forest-dark',
		name: 'forest',
		label: 'Forest Dark',
		displayLabel: 'Forest Dark',
		mode: 'dark',
		description: 'Greens and earth tones'
	},
	{
		id: 'sunset-light',
		name: 'sunset',
		label: 'Sunset',
		displayLabel: 'Sunset',
		mode: 'light',
		description: 'Warm oranges and reds'
	},
	{
		id: 'sunset-dark',
		name: 'sunset',
		label: 'Sunset Dark',
		displayLabel: 'Sunset Dark',
		mode: 'dark',
		description: 'Warm oranges and reds'
	},
	{
		id: 'lavender-light',
		name: 'lavender',
		label: 'Lavender',
		displayLabel: 'Lavender',
		mode: 'light',
		description: 'Purples and pinks'
	},
	{
		id: 'lavender-dark',
		name: 'lavender',
		label: 'Lavender Dark',
		displayLabel: 'Lavender Dark',
		mode: 'dark',
		description: 'Purples and pinks'
	}
];

export const legacyThemes = [
	{ name: 'synthwave', text: 'Synthwave' },
	{ name: 'night', text: 'Night' },
	{ name: 'lofi', text: 'Lo-Fi' },
	{ name: 'christmas', text: 'Christmas' },
	{ name: 'black', text: 'Black' },
	{ name: 'dark', text: 'Dark' },
	{ name: 'halloween', text: 'Halloween' },
	{ name: 'dracula', text: 'Dracula' },
	{ name: 'cyberpunk', text: 'Cyberpunk' },
	{ name: 'business', text: 'Business' },
	{ name: 'coffee', text: 'Coffee' },
	{ name: 'forest', text: 'Forest' },
	{ name: 'wireframe', text: 'Wireframe' },
	{ name: 'retro', text: 'Retro' },
	{ name: 'luxury', text: 'Luxury' },
	{ name: 'fantasy', text: 'Fantasy' },
	{ name: 'winter', text: 'Winter' },
	{ name: 'bumblebee', text: 'Bumblebee' },
	{ name: 'light', text: 'Light' },
	{ name: 'cupcake', text: 'Cupcake' },
	{ name: 'emerald', text: 'Emerald' },
	{ name: 'corporate', text: 'Corporate' },
	{ name: 'valentine', text: 'Valentine' },
	{ name: 'garden', text: 'Garden' },
	{ name: 'aqua', text: 'Aqua' },
	{ name: 'pastel', text: 'Pastel' },
	{ name: 'cmyk', text: 'CMYK' },
	{ name: 'autumn', text: 'Autumn' },
	{ name: 'acid', text: 'Acid' },
	{ name: 'lemonade', text: 'Lemonade' }
];
