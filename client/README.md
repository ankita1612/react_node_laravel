1.installation
npm create vite@latest

    npm install react-hook-form yup @hookform/resolvers

    npm install react-router-dom axios

    npm install -D tailwindcss postcss autoprefixer

2.app.tsx
remove : import './App.css'

3. main.tsx
   remove : code from import './index.css' any paste

@tailwind base;
@tailwind components;
@tailwind utilities;

3.get env variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

Form + typescript + rHF
https://medium.com/@msgold/creating-a-react-form-using-react-hook-form-and-yup-in-typescript-640168c5ed57

Axios
https://saurabhnativeblog.medium.com/react-30-project-10-building-user-authentication-forms-using-react-js-and-react-router-1e3f2efa0c3a

crud
https://www.geeksforgeeks.org/reactjs/how-to-do-crud-operations-in-reactjs/

+++++++++++++++++++++
for bootstrap icon
+++++++++++++++++++++
npm install bootstrap-icons

    in my page add import "bootstrap-icons/font/bootstrap-icons.css";

<Button variant="light">
  <i className="bi bi-arrow-up"></i>
</Button>

<Button variant="light">
  <i className="bi bi-arrow-down"></i>
</Button>
    +++++++++++++++++++++
