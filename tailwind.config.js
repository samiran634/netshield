/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    theme: {
      extend: {
        animation: {
          aurora: "aurora 60s linear infinite",
        },
        keyframes: {
          aurora: {
            from: { backgroundPosition: "50% 50%, 50% 50%" },
            to: { backgroundPosition: "350% 50%, 350% 50%" },
          },
        },
      },
    },
    plugins: [addVariablesForColors],
  };
  
  // Updated for Tailwind v4
  function addVariablesForColors({ addBase, theme }) {
    const colors = theme("colors");
    let newVars = {};
  
    // Process the color object into CSS variables
    Object.entries(colors).forEach(([colorName, colorValue]) => {
      if (typeof colorValue === "string") {
        newVars[`--${colorName}`] = colorValue;
      } else if (typeof colorValue === "object") {
        Object.entries(colorValue).forEach(([shade, shadeValue]) => {
          newVars[`--${colorName}-${shade}`] = shadeValue;
        });
      }
    });
  
    addBase({ ":root": newVars });
  }