tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            colors: {
                background: '#000000', // Absolute Black
                surface: '#0a0a0a', // Slightly lighter for contrast
                primary: '#0052FF', // Blue Start
                secondary: '#4b5563', // Gray
                accent: '#00A3FF', // Blue End
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'slide-up': 'slideUp 0.8s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-blue': 'pulseBlue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseBlue: {
                    '0%, 100%': { boxShadow: '0 0 0 2px #0052FF, 0 0 10px rgba(0, 82, 255, 0.4)' }, // Blue start
                    '50%': { boxShadow: '0 0 0 2px #00A3FF, 0 0 20px rgba(0, 163, 255, 0.6)' }, // Cyan peak
                }
            }
        }
    }
}
