export const CONFIG = {
  DEFAULT_LANG: 'fr',
  DEFAULT_LOCALE: 'fr',
  LANGUAGES: [
    { key: 'fr', label: 'Fr' },
    { key: 'ar', label: 'Ar' },
  ],
  APP_BASE_COLOR: '#0A4D6C',
  PRIVATE_LAYOUT: {
    sidebar: {
      width: '292px',
      'background-color': 'transparent',
      compact_menu: false,
    },
    footer: {
      display: true,
      max_height: { lt_md: '40px', gt_md: '30px' },
      min_height: { lt_md: '40px', gt_md: '30px' },
      height: { 'lt-md': '40px', 'gt-md': '30px' },
    },
    navbar: {
      display: true,
      'max-height': { 'lt-md': '85px', 'gt-md': '64px' },
      'min-height': { 'lt-md': '85px', 'gt-md': '64px' },
      height: { 'lt-md': '85px', 'gt-md': '64px' },
      'background-color': '#eaeaea',
    },
  },
};
