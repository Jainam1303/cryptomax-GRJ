/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F0B90B',
          50: '#FEF6D9',
          100: '#FEF0C5',
          200: '#FCE49D',
          300: '#FBD874',
          400: '#F9CC4C',
          500: '#F0B90B',
          600: '#C09209',
          700: '#8F6C07',
          800: '#5F4704',
          900: '#2F2302'
        },
        secondary: {
          DEFAULT: '#0052FF',
          50: '#D6E4FF',
          100: '#C2D5FF',
          200: '#99B8FF',
          300: '#709BFF',
          400: '#477EFF',
          500: '#0052FF',
          600: '#0042CC',
          700: '#003199',
          800: '#002166',
          900: '#001033'
        },
        accent: {
          DEFAULT: '#627EEA',
          50: '#FFFFFF',
          100: '#F3F5FD',
          200: '#D0D8F8',
          300: '#ACBAF3',
          400: '#899CEE',
          500: '#627EEA',
          600: '#3055E3',
          700: '#1A3ACF',
          800: '#142CA0',
          900: '#0F1F71'
        },
        success: {
          DEFAULT: '#16C784',
          50: '#D0F6E9',
          100: '#B1F1DC',
          200: '#73E7C1',
          300: '#35DCA6',
          400: '#16C784',
          500: '#119964',
          600: '#0C6C46',
          700: '#073F29',
          800: '#03120B',
          900: '#000000'
        },
        danger: {
          DEFAULT: '#EA3943',
          50: '#FDE7E8',
          100: '#FBD0D3',
          200: '#F7A1A7',
          300: '#F3737B',
          400: '#EE444F',
          500: '#EA3943',
          600: '#D01822',
          700: '#A1131A',
          800: '#720D13',
          900: '#43070B'
        },
        warning: {
          DEFAULT: '#F3841E',
          50: '#FDEFDF',
          100: '#FCE4CB',
          200: '#FACFA3',
          300: '#F8B97B',
          400: '#F5A453',
          500: '#F3841E',
          600: '#D46A09',
          700: '#A25107',
          800: '#703804',
          900: '#3E1F02'
        },
        info: {
          DEFAULT: '#0ECAF0',
          50: '#DCF7FD',
          100: '#C8F3FC',
          200: '#A1ECFA',
          300: '#79E4F8',
          400: '#52DDF6',
          500: '#0ECAF0',
          600: '#0BA2C2',
          700: '#087994',
          800: '#065166',
          900: '#032838'
        },
        dark: {
          100: '#1E1E1E',
          200: '#2D2D2D',
          300: '#3C3C3C',
          400: '#4B4B4B',
          500: '#5A5A5A',
          600: '#696969',
          700: '#787878',
          800: '#878787',
          900: '#969696'
        },
        light: {
          100: '#FFFFFF',
          200: '#F5F5F5',
          300: '#E8E8E8',
          400: '#DBDBDB',
          500: '#CECECE',
          600: '#C1C1C1',
          700: '#B4B4B4',
          800: '#A7A7A7',
          900: '#9A9A9A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      boxShadow: {
        card: '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1)',
        nav: '0 2px 4px rgba(0, 0, 0, 0.1)',
        sidebar: '2px 0 5px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}