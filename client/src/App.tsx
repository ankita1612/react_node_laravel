import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Toast } from "./utils/toast";

function App() {
  // useEffect(() => {
  //   Toast.success("Data saved successfully!");
  //   Toast.error("Something went wrong!");
  //   Toast.info("New update available!");
  //   Toast.warning("Check your input!");
  // }, []);

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-600">
          React + Tailwind + TS 🚀
        </h1>
      </div>
    </>
  );
}

export default App;
