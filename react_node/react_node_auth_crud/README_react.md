🚀step 1 :

- go to client folder
- npm create vite@latest
  Choose:
  ✔ React
  ✔ TypeScript

🚀Step 2 :
npm install -D postcss @tailwindcss/postcss autoprefixer
npm install react-hook-form yup @hookform/resolvers
npm install react-router-dom axios
npm install react-toastify
npm install lucide-react
npm install react-icons
🚀Step 3 :

1. Create tailwind.config.js

/** @type {import('tailwindcss').Config} \*/
export default {
content: [
"./index.html",
"./src/**/\*.{js,ts,jsx,tsx}",
],
theme: {
extend: {},
},
plugins: [],
}

2.Create postcss.config.js
export default {
plugins: {
"@tailwindcss/postcss": {},
autoprefixer: {},
},
};

🚀Step 4 :
Open: src/index.css

Replace everything with:

@import "tailwindcss";

---OR--
@tailwind base;
@tailwind components;
@tailwind utilities;

🚀Step 5 — Import CSS

Open src/main.tsx:

import './index.css'; // ✅ required

🚀 Step 6 — Start project
npm run dev
🚀 Step 7 — Test Tailwind

Replace App.tsx:

function App() {
return (

<div className="flex items-center justify-center h-screen bg-gray-100">
<h1 className="text-3xl font-bold text-blue-600">
React + Tailwind + TS 🚀
</h1>
</div>
);
}

export default App;

+++++++++++Toaster MSG+++++++++++++

1. main.tsx,
2. app.tsx
3. src\utils\toast.ts
