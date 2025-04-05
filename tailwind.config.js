/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: '#8B5CF6',
              dark: '#7C3AED',
              light: '#A78BFA'
            },
            lightning: '#F7931A',
            dark: {
              DEFAULT: '#111827',
              lighter: '#1F2937',
              card: '#252836',
              border: '#374151'
            },
            light: {
              DEFAULT: '#F9FAFB',
              muted: '#D1D5DB'
            }
          },
          fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
          },
          backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          },
          boxShadow: {
            'glow': '0 0 15px rgba(139, 92, 246, 0.5)'
          }
        },
      },
    plugins: [],
  }