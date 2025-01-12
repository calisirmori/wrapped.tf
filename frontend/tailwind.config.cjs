module.exports = {
  darkMode: 'class', // DaisyUI works with class-based dark mode
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'topo-dark': "url('/topo-background-dark.svg')",
        'topo-light': "url('/topo-background-light.svg')",
      },
      fontFamily: {
        londrina: ['"Londrina Solid"', 'cursive'],
        istok: ['"Istok Web"', 'cursive'], // Fallback to cursive
      },
      fontSize: {
        clamp: "clamp(1rem, 5vw, 2.6rem)",
      },
      colors: {
        'tf-orange':'#F08149',
        'tf-orange-dark':'#A35832',
        'tf-red':'#BD3B3B',
        'tf-red-dark':'#802828',
        'tf-red-dark2':'#4A1B1B',
        'tf-blue':'#395C78',
        'tf-blue-dark':'#273E51',
        'tf-blue-dark2':'#1B2731',
        warmscale: {
          8: '#141312',
          7: '#1F1D1B',
          6: '#292624',
          5: '#34302D',
          4: '#3F3A36',
          3: '#49433F',
          2: '#544D48',
          1: '#5E5751',
          0: '#69615A',
        },
        lightscale: {
          9: '#736A64',
          8: '#7E746D',
          7: '#887E76',
          6: '#918880',
          5: '#A49B95',
          4: '#B6AFAA',
          3: '#C8C3BF',
          2: '#DAD7D4',
          1: '#ECEBE9',
          0: '#F5F5F4',
        },
        lightmode: {
          primary: "#1f1d1b",
          secondary: "#3f3a36",
          tertiary: "#887e76",
          background: "#c8c3bf",
          border: "#b6afaa",
        },
        darkmode: {
          primary: "#f5f5f4",
          secondary: "#a49b95",
          tertiary: "#c05c29",
          background: "#1f1d1b",
          border: "#292624",
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
  },
};