tailwind.config = {
    darkMode: 'media',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'system-ui', 'sans-serif'],
                heading: ['Manrope', 'system-ui', 'sans-serif'],
            },
            colors: {
                background: '#F6F8FB',
                ink: '#111827',
                surface: '#FFFFFF',
                'surface-alt': '#EAF0F6',
                primary: '#1D4ED8',
                'primary-dark': '#173EA8',
                secondary: '#526173',
                accent: '#1D4ED8',
                'text-ink': '#111827',
                'text-inverse': '#F8FAFC',
                muted: '#526173',
            },
            animation: {
                'fade-in': 'fadeIn 0.72s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-up': 'slideUp 0.72s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(18px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            }
        }
    }
}
