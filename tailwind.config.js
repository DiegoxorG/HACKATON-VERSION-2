export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif']
      },
      colors: {
        brand: { blue: '#1B3A6B', mid: '#2D5FA6', light: '#EEF4FF' },
        gold: { DEFAULT: '#F5A623', light: '#FFF8E7' }
      }
    }
  },
  plugins: []
}
