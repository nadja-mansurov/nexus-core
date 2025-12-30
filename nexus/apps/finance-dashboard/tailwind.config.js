// Import shared Tailwind preset from ui-shared
const uiSharedPreset = require('../../libs/ui-shared/tailwind.preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Use preset from ui-shared for theme and plugins
  presets: [uiSharedPreset],
  // Apps still need to define their own content paths
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
    // Include ui-shared library components so Tailwind scans them
    '../../libs/ui-shared/src/**/*.{ts,tsx,js,jsx,html}',
    '!../../libs/ui-shared/src/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
  ],
};

