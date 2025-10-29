/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/main/ts/**/*.{ts,html}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // Light theme colors
        light: {
          // Surface colors - backgrounds
          'surface-primary': '#ffffff',
          'surface-secondary': '#f8fafc',
          'surface-tertiary': '#f1f5f9',
          'surface-accent': '#eff6ff',

          // Text colors
          'text-primary': '#0f172a',
          'text-secondary': '#475569',
          'text-tertiary': '#64748b',
          'text-accent': '#2563eb',
          'text-inverse': '#ffffff',

          // Border colors
          'border-subtle': '#e2e8f0',
          'border-default': '#cbd5e1',
          'border-emphasis': '#94a3b8',

          // Action/Interactive colors
          'action-primary': '#2563eb',
          'action-primary-hover': '#1d4ed8',
          'action-secondary': '#7c3aed',
          'action-secondary-hover': '#6d28d9',

          // Status colors
          'status-success': '#16a34a',
          'status-warning': '#ea580c',
          'status-error': '#dc2626',
          'status-info': '#0284c7',
        },

        // Dark theme colors
        dark: {
          // Surface colors - backgrounds
          'surface-primary': '#0f172a',
          'surface-secondary': '#1e293b',
          'surface-tertiary': '#334155',
          'surface-accent': '#1e3a8a',

          // Text colors
          'text-primary': '#f1f5f9',
          'text-secondary': '#cbd5e1',
          'text-tertiary': '#94a3b8',
          'text-accent': '#60a5fa',
          'text-inverse': '#0f172a',

          // Border colors
          'border-subtle': '#334155',
          'border-default': '#475569',
          'border-emphasis': '#64748b',

          // Action/Interactive colors
          'action-primary': '#3b82f6',
          'action-primary-hover': '#60a5fa',
          'action-secondary': '#8b5cf6',
          'action-secondary-hover': '#a78bfa',

          // Status colors
          'status-success': '#22c55e',
          'status-warning': '#f97316',
          'status-error': '#ef4444',
          'status-info': '#0ea5e9',
        },
      },
    },
  },
  plugins: [],
}
